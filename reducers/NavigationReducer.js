import RNProvider from '../RNProvider'
const RouterProvider = RNProvider.Router
const Router = RouterProvider.Router

const initialState = Router.router.getStateForAction(
  Router.router.getActionForPathAndParams(RouterProvider.InitialRouteName)
)
const navigationReducer = (state = initialState, action) => {
  const newState = Router.router.getStateForAction(action, state);
  return newState || state;
};

export default navigationReducer;
