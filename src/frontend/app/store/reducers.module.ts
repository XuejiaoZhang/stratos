import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';

import { environment } from '../../environments/environment';
import { actionHistoryReducer } from './reducers/action-history-reducer';
import { requestDataReducer, requestReducer } from './reducers/api-request-reducers.generator';
import { authReducer } from './reducers/auth.reducer';
import { createAppReducer } from './reducers/create-application.reducer';
import { createServiceInstanceReducer } from './reducers/create-service-instance.reducer';
import { currentUserRolesReducer } from './reducers/current-user-roles-reducer/current-user-roles.reducer';
import { dashboardReducer } from './reducers/dashboard-reducer';
import { deployAppReducer } from './reducers/deploy-app.reducer';
import { endpointsReducer } from './reducers/endpoints.reducer';
import { internalEventReducer } from './reducers/internal-events.reducer';
import { listReducer } from './reducers/list.reducer';
import { requestPaginationReducer } from './reducers/pagination-reducer.generator';
import { routingReducer } from './reducers/routing.reducer';
import { uaaSetupReducer } from './reducers/uaa-setup.reducers';
import { UsersRolesReducer } from './reducers/users-roles.reducer';


export function logger(reducer) {
  // default, no options
  return storeLogger()(reducer);
}

export const appReducers = {
  auth: authReducer,
  uaaSetup: uaaSetupReducer,
  endpoints: endpointsReducer,
  pagination: requestPaginationReducer,
  request: requestReducer,
  requestData: requestDataReducer,
  dashboard: dashboardReducer,
  createApplication: createAppReducer,
  deployApplication: deployAppReducer,
  createServiceInstance: createServiceInstanceReducer,
  actionHistory: actionHistoryReducer,
  lists: listReducer,
  routing: routingReducer,
  manageUsersRoles: UsersRolesReducer,
  internalEvents: internalEventReducer,
  currentUserRoles: currentUserRolesReducer
} as ActionReducerMap<{}>;

let metaReducers = [];
if (!environment.production) {
  metaReducers = [storeFreeze];
  if (environment.logEnableConsoleActions) {
    metaReducers.push(logger);
  }
}
const store = StoreModule.forRoot(
  appReducers,
  {
    metaReducers
  }
);
const imports = environment.production ? [
  store
] : [
    store,
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: !environment.production
    })
  ];

@NgModule({
  imports
})
export class AppReducersModule { }
