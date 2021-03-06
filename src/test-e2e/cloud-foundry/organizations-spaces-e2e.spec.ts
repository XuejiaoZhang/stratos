import { CloudFoundryPage } from '../cloud-foundry/cloud-foundry.po';
import { e2e } from '../e2e';
import { EndpointsPage } from '../endpoints/endpoints.po';
import { ConsoleUserType } from '../helpers/e2e-helpers';
import { SideNavMenuItem, SideNavigation } from '../po/side-nav.po';
import { StepperComponent } from '../po/stepper.po';
import { ListComponent } from '../po/list.po';
import { ConfirmDialogComponent } from '../po/confirm-dialog';
import { MetaCard } from '../po/meta-card.po';
import { CFHelpers } from '../helpers/cf-helpers';
import { browser, ElementArrayFinder } from 'protractor';
import { mergeEntity } from '../../frontend/app/store/helpers/reducer.helper';

describe('CF - Manage Organizations and Spaces', () => {

  const testOrgName = e2e.helper.getCustomerOrgSpaceLabel(null, 'org');
  const testSpaceName = e2e.helper.getCustomerOrgSpaceLabel(null, 'space');
  let endpointGuid;

  let cloudFoundry: CloudFoundryPage;

  let cfHelper: CFHelpers;

  beforeAll(() => {
    const setup = e2e.setup(ConsoleUserType.admin)
      .clearAllEndpoints()
      .registerDefaultCloudFoundry()
      // Connect the test non-admin user to all cnsis in params
      .connectAllEndpoints(ConsoleUserType.user)
      // Connect the test admin user to all cnsis in params (required to ensure correct permissions are set when
      // creating orgs + spaces)
      .connectAllEndpoints(ConsoleUserType.admin)
      .getInfo(ConsoleUserType.admin);

    cfHelper = new CFHelpers(setup);

  });

  beforeEach(() => {
    const endpointName = e2e.secrets.getDefaultCFEndpoint().name;
    endpointGuid = e2e.helper.getEndpointGuid(e2e.info, endpointName);
    // Go to the org view for this CF
    cloudFoundry = CloudFoundryPage.forEndpoint(endpointGuid);
    cloudFoundry.navigateTo();
    cloudFoundry.waitForPageOrChildPage();
  });

  afterAll(() => {
    return cfHelper.deleteSpaceIfExisting(endpointGuid, testSpaceName).then(() =>
      cfHelper.deleteOrgIfExisting(endpointGuid, testOrgName)
    );
  });

  it('Should validate org name', () => {
    const cardView = cloudFoundry.gotoOrgView();
    cardView.cards.getCards().then(cards => {
      const card = new MetaCard(cards[0]);
      card.getTitle().then(existingTitle => {
        // Click the add button to add an organization
        cloudFoundry.header.clickIconButton('add');
        const modal = new StepperComponent();

        // Can't add with empty name
        expect(modal.canNext()).toBeFalsy();

        modal.getStepperForm().fill({
          'orgname': testOrgName
        });
        expect(modal.canNext()).toBeTruthy();

        // Can't use a name already taken
        modal.getStepperForm().fill({
          'orgname': existingTitle
        });
        expect(modal.canNext()).toBeFalsy();

        // Cancel
        modal.cancel();
        expect(cardView.cards.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('Create and delete an organization', () => {
    // Count the number of organizations
    let orgCount = 0;
    const cardView = cloudFoundry.gotoOrgView();
    cardView.cards.getCards().count().then(count => orgCount = count);

    // Click the add button to add an organization
    cloudFoundry.header.clickIconButton('add');
    const modal = new StepperComponent();
    modal.getStepperForm().fill({
      'orgname': testOrgName
    });
    expect(modal.canNext()).toBeTruthy();
    modal.next();

    cardView.cards.waitUntilShown();
    cardView.cards.getCards().count().then((newOrgCount) => expect(newOrgCount).toEqual(orgCount + 1));

    // Delete the org
    cardView.cards.findCardByTitle(testOrgName).then(card => {
      card.openActionMenu().then(menu => {
        menu.clickItem('Delete');
        ConfirmDialogComponent.expectDialogAndConfirm('Delete', 'Delete Organization');
        // Wait until the card has gone
        card.waitUntilNotShown();
      });
    });
  });

  it('should show the Organization CLI commands', () => {
    // Open the first org
    const cardView = cloudFoundry.gotoOrgView();
    const card = cardView.cards.getCard(0);
    card.getTitle().then(title => {
      card.click();
      // Should be org view
      cloudFoundry.header.clickIconButton('keyboard');
      expect(cloudFoundry.header.getTitleText()).toBe('CLI Info');
      cloudFoundry.breadcrumbs.getBreadcrumbs().then(breadcrumbs => {
        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[1].label).toBe(title);
      });
    });
  });

  it('Should create and delete space', () => {
    expect(testOrgName).toBeDefined();
    expect(testSpaceName).toBeDefined();

    const ep = e2e.secrets.getDefaultCFEndpoint();
    browser.driver.wait(cfHelper.addOrgIfMissingForEndpointUsers(endpointGuid, ep, testOrgName));

    // Go to org tab
    const cardView = cloudFoundry.gotoOrgView();
    cloudFoundry.list.refresh();
    cardView.cards.findCardByTitle(testOrgName).then(org => {
      org.click();

      cloudFoundry.subHeader.clickItem('Spaces');
      cardView.cards.waitUntilShown();
      cloudFoundry.list.refresh();

      // Add space
      // Click the add button to add a space
      cloudFoundry.header.clickIconButton('add');

      const modal = new StepperComponent();
      modal.getStepperForm().fill({
        'spacename': testSpaceName
      });
      expect(modal.canNext()).toBeTruthy();
      modal.next();

      cloudFoundry.subHeader.clickItem('Spaces');
      cardView.cards.waitUntilShown();

      // Get the card for the space
      cardView.cards.findCardByTitle(testSpaceName).then(space => {
        space.openActionMenu().then(menu => {
          menu.clickItem('Delete');
          ConfirmDialogComponent.expectDialogAndConfirm('Delete', 'Delete Space');
          cardView.cards.getCardCound().then(c => {
            expect(c).toBe(0);
          });
        });
      });
    });
  });
});

