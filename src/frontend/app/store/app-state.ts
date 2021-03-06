import { ActionHistoryState } from './reducers/action-history-reducer';
import { AuthState } from './reducers/auth.reducer';
import { DashboardState } from './reducers/dashboard-reducer';
import { ListsState } from './reducers/list.reducer';
import { CreateNewApplicationState } from './types/create-application.types';
import { CreateServiceInstanceState } from './types/create-service-instance.types';
import { ICurrentUserRolesState } from './types/current-user-roles.types';
import { DeployApplicationState } from './types/deploy-application.types';
import { EndpointState } from './types/endpoint.types';
import { IRequestDataState, IRequestState } from './types/entity.types';
import { InternalEventsState } from './types/internal-events.types';
import { PaginationState } from './types/pagination.types';
import { RoutingHistory } from './types/routing.type';
import { UAASetupState } from './types/uaa-setup.types';
import { UsersRolesState } from './types/users-roles.types';

export interface IRequestTypeState {
  [entityKey: string]: IRequestEntityTypeState<any>;
}
export interface IRequestEntityTypeState<T> {
  [guid: string]: T;
}
export interface AppState {
  actionHistory: ActionHistoryState;
  auth: AuthState;
  uaaSetup: UAASetupState;
  endpoints: EndpointState;
  pagination: PaginationState;
  request: IRequestState;
  requestData: IRequestDataState;
  dashboard: DashboardState;
  createApplication: CreateNewApplicationState;
  deployApplication: DeployApplicationState;
  createServiceInstance: CreateServiceInstanceState;
  lists: ListsState;
  routing: RoutingHistory;
  manageUsersRoles: UsersRolesState;
  internalEvents: InternalEventsState;
  currentUserRoles: ICurrentUserRolesState;
}
