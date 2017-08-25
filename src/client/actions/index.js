import { bindActionCreators } from 'redux';

import * as stockActions from './stockActions';

import store from '../../shared/store';

const allActions = {
  ...stockActions,
};

//  'Prebind' the Redux store's dispatch() to all action creators for easier usage.
//  Components don't need connect() to be able to dispatch actions this way.
export default bindActionCreators(allActions, store.dispatch);
