import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { arrayHelper } from '../../../../../../core/helper-classes/array.helper';
import { getOrgRoles, OrgUserRoles } from '../../../../../../features/cloud-foundry/cf.helpers';
import { RemoveUserPermission } from '../../../../../../store/actions/users.actions';
import { AppState } from '../../../../../../store/app-state';
import { cfUserSchemaKey, entityFactory } from '../../../../../../store/helpers/entity-factory';
import { APIResource } from '../../../../../../store/types/api.types';
import { CfUser, IUserPermissionInOrg } from '../../../../../../store/types/user.types';
import { CfUserService } from '../../../../../data-services/cf-user.service';
import { EntityMonitor } from '../../../../../monitors/entity-monitor';
import { CfPermissionCell, ICellPermissionList } from '../cf-permission-cell';

@Component({
  selector: 'app-org-user-permission-cell',
  templateUrl: './cf-org-permission-cell.component.html',
  styleUrls: ['./cf-org-permission-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CfOrgPermissionCellComponent extends CfPermissionCell<OrgUserRoles> {
  constructor(
    public store: Store<AppState>,
    public cfUserService: CfUserService
  ) {
    super();
  }

  protected setChipConfig(row: APIResource<CfUser>) {
    const userRoles = this.cfUserService.getOrgRolesFromUser(row.entity);
    const userOrgPermInfo = arrayHelper.flatten<ICellPermissionList<OrgUserRoles>>(
      userRoles.map(orgPerms => this.getOrgPermissions(orgPerms, row))
    );
    this.chipsConfig = this.getChipConfig(userOrgPermInfo);
  }

  private getOrgPermissions(orgPerms: IUserPermissionInOrg, row: APIResource<CfUser>) {
    return getOrgRoles(orgPerms.permissions).map(perm => {
      const updatingKey = RemoveUserPermission.generateUpdatingKey(
        orgPerms.orgGuid,
        perm.key,
        row.metadata.guid
      );
      return {
        ...perm,
        name: orgPerms.name,
        orgId: orgPerms.orgGuid,
        busy: new EntityMonitor(
          this.store,
          row.metadata.guid,
          cfUserSchemaKey,
          entityFactory(cfUserSchemaKey)
        ).getUpdatingSection(updatingKey).pipe(
          map(update => update.busy)
        )
      };
    });
  }

  public removePermission(cellPermission: ICellPermissionList<OrgUserRoles>) {
    this.store.dispatch(new RemoveUserPermission(
      this.guid,
      cellPermission.id,
      cellPermission.key
    ));
  }
}