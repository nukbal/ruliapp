import AppNavigator from '../../containers';

const initState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Board'));

export default function reducer(state = initState, action = {}) {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
}
