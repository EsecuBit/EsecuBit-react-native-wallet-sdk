//
//  BtDeviceModule.m
//  EsWallet
//
//  Created by chenhao on 2018/7/27.
//  Copyright © 2018年 Excelsecu. All rights reserved.
//
#import "BtDeviceModule.h"
#import "BtScanHelper.h"
#import "EsHDWallet.h"
#import "NSData+Hex.h"
#import "DDRSAWrapper.h"
#import <CoreBluetooth/CoreBluetooth.h>


#define STATUS_DISCONNECTED @0
#define STATUS_CONNECTING @5
#define STATUS_CONNECTED @10
#define STATUS_BLUETOOTH_ON @20
#define STATUS_BLUETOOTH_OFF @21


@interface BtDeviceModule ()<ScanDelegate,EsHDWalletDelegate, CBCentralManagerDelegate>

@property (strong, nonatomic) BtScanHelper *btScanHelper;
@property (strong, nonatomic) EsHDWallet *wallet;
@property (nonatomic) NSNumber *state;
@property (nonatomic) NSNumber *bleState;
@property(strong,nonatomic)CBCentralManager* cm;



@end

@implementation BtDeviceModule

RCT_EXPORT_MODULE(BtDevice);

- (instancetype) init {
  self = [super init];
  if (self) {
    self.btScanHelper = [BtScanHelper sharedBtScanHelper];
    self.btScanHelper.delegate = self;
    self.wallet = [[EsHDWallet alloc] init];
    self.wallet.delegate = self;
    self.state = STATUS_DISCONNECTED;
    self.cm = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
    self.bleState = STATUS_BLUETOOTH_OFF;
  }
  return self;
}

- (NSDictionary *)constantsToExport
{
  return @{
           @"disconnected": STATUS_DISCONNECTED,
           @"connecting": STATUS_CONNECTING,
           @"connected": STATUS_CONNECTED,
           @"bluetooth_on": STATUS_BLUETOOTH_ON,
           @"bluetooth_off": STATUS_BLUETOOTH_OFF,
           };
}

- (void)centralManagerDidUpdateState:(CBCentralManager *)central{
  switch (central.state) {
    case CBManagerStatePoweredOn:
      self.bleState = STATUS_BLUETOOTH_ON;
      break;
    case CBManagerStatePoweredOff:
      self.bleState = STATUS_BLUETOOTH_OFF;
      break;
    default:
      break;
  }
}

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
  NSArray *events = [NSArray arrayWithObjects:@"hello", @"world", nil];
  resolve(events);
}

RCT_EXPORT_METHOD(getState:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(self.state);
}

RCT_EXPORT_METHOD(getBleState:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(self.bleState);
}

RCT_EXPORT_METHOD(startScan)
{
  [self.btScanHelper startScan];
}

RCT_EXPORT_METHOD(stopScan)
{
  [self.btScanHelper stopScan];
}

RCT_EXPORT_METHOD(connect:(NSDictionary *)info)
{
  NSString *sn = [info objectForKey:@"sn"];
  self.state = STATUS_CONNECTING;
  [self sendConnectStatusWithError:0 status:STATUS_CONNECTING pairCode:@""];
  EsHDWallet *weakWallet = self.wallet;
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    EsErrorCode errorCode = [weakWallet connectWithSerialNumber:sn];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (errorCode == ESErrorNoError) {
        self.state = STATUS_CONNECTED;
        [self sendConnectStatusWithError:errorCode status:STATUS_CONNECTED pairCode:@""];
      } else {
        self.state = STATUS_DISCONNECTED;
        [self sendConnectStatusWithError:errorCode status:STATUS_DISCONNECTED pairCode:@""];
      }
    });
  });
}

RCT_EXPORT_METHOD(disconnect)
{
  [self.wallet disconnect];
  self.state = STATUS_DISCONNECTED;
  [self sendConnectStatusWithError:0 status:STATUS_DISCONNECTED pairCode:@""];
}

RCT_EXPORT_METHOD(sendApdu:(NSString *)apdu
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    NSData *apduData = [NSData fromHex:apdu];
    NSData *response = [self.wallet sendAPDUWithData:apduData];
    UInt32 error = [self.wallet getLastNativeErrorCode];
    if (error != 0) {
      // TODO UPDATE newest react0native version, reject has only one argument
      reject([[NSString alloc] initWithFormat:@"%x", error], @"apdu error", nil);
      return;
    }
    resolve([response toHex]);
  });
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"newDevice", @"connectStatus"];
}

- (void) didDescoverPeripheral:(NSString *)keyName peripheral:(CBPeripheral *)peripheral {
  [self sendNewDeviceWithError:0 sn:keyName];
}

- (void)didChangeEsBLEState:(EsBLEState)bleState pairingCode:(NSString *)pairingCode
{
  NSLog(@"bleState == %ld, pairingCode == %@",(long)bleState,pairingCode);
  switch (bleState) {
    case ESBLEStateConnected: {
      self.state = STATUS_CONNECTED;
      [self sendConnectStatusWithError:0 status:STATUS_CONNECTED pairCode: @""];
    }
    case ESBLEStateDisconnected:
    {
      self.state = STATUS_DISCONNECTED;
      [self sendConnectStatusWithError:0 status:STATUS_DISCONNECTED pairCode:@""];
    }
      break;
    default:
      break;
  }
}

- (void)sendNewDeviceWithError:(int)error sn:(NSString *)sn
{
  [self sendEventWithName:@"newDevice" body:@{
    @"error": [NSNumber numberWithInt:error],
    @"sn": sn
  }];
}

- (void)sendConnectStatusWithError:(int)error status:(NSNumber *)status pairCode:(NSString *)pairCode
{
  [self sendEventWithName:@"connectStatus" body:@{
    @"error": [NSNumber numberWithInt:error],
    @"status": status,
    @"pairCode":pairCode,
  }];
}

@end
