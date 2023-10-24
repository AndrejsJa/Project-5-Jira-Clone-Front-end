/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

const issueTitle = 'This is an issue of type: Task.';

describe('Issue delete', () => {
  before(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.contains(issueTitle).click();
    });
  });

  it('Should delete issue successfully', () => {
    const expectedAmountOfIssuesAfterDeletion = 3;

    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateAmountOfIssuesInBacklog(expectedAmountOfIssuesAfterDeletion);
  });

  it.only('Should cancel delete issue process successfully', () => {
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.contains(issueTitle).click();
      const expectedAmountOfIssuesAfterCancel = 4;

      IssueModal.clickDeleteButton();
      IssueModal.cancelDeletion();
      IssueModal.closeDetailModal();
      IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
      IssueModal.validateAmountOfIssuesInBacklog(expectedAmountOfIssuesAfterCancel);
    });
  });
});  
