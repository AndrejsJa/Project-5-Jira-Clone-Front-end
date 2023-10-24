//performing initialization bug report in Jira.

const title = 'Issue time tracking';
const description = 'Description of time tracking issue';
const originalEstimation = 10;
const updatedEstimation = 20;

describe('Issue time tracking', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
			cy.visit(url + '/board?modal-issue-create=true');
			cy.get('[data-testid="modal:issue-create"]').within(() => {
				cy.get('.ql-editor').type(description);
				cy.get('input[name="title"]').type(title);
				cy.get('button[type="submit"]').click();
			});
			cy.get('[data-testid="modal:issue-create"]').should('not.exist');
			cy.contains('Issue has been successfully created.').should('be.visible');
			cy.reload();
			cy.contains('Issue has been successfully created.').should('not.exist');
			cy.wait(3000);
			cy.get('[data-testid="list-issue"]').contains(title).click();
		});
	});

	function IssueDetailsExist() {
		cy.get('[data-testid="modal:issue-details"]')
			.should('be.visible');
	}
	function closeIssueWindow() {
		cy.get('[data-testid="icon:close"]')
			.eq(0)
			.click();
		cy.get('[data-testid="modal:issue-details"]')
			.should('not.exist');
	}
	function visibleIssueList() {
		cy.get('[data-testid="list-issue"]')
			.should('be.visible');
	}
	function clickOnCreatedIssue() {
		cy.get('[data-testid="list-issue"]')
			.contains(title)
			.click();
		cy.get('[data-testid="modal:issue-details"]')
			.should('be.visible');
	}

	it('Should be able to add, update and remove estimated time on issue', () => {
		IssueDetailsExist();
		cy.get('input[placeholder="Number"]').should('be.empty');
		cy.get('input[placeholder="Number"]').click().type(originalEstimation);
		cy.contains('Original Estimate (hours)').click();
		cy.get('input[placeholder="Number"]').should('have.value', originalEstimation);
		cy.get('[data-testid="icon:stopwatch"]').siblings().contains('10h estimated');
		closeIssueWindow();
		clickOnCreatedIssue();
		cy.get('input[placeholder="Number"]').should('have.value', originalEstimation);
		closeIssueWindow();
		visibleIssueList();

		clickOnCreatedIssue();
		cy.get('input[placeholder="Number"]').should('have.value', originalEstimation).clear();
		cy.get('input[placeholder="Number"]').click().type(updatedEstimation);
		cy.contains('Description').click();
		cy.get('input[placeholder="Number"]').should('have.value', updatedEstimation);
		cy.get('[data-testid="icon:stopwatch"]').siblings().contains('20h estimated');
		closeIssueWindow();

		clickOnCreatedIssue();
		cy.get('input[placeholder="Number"]').should('have.value', updatedEstimation);
		closeIssueWindow();
		visibleIssueList();
		clickOnCreatedIssue();
		cy.get('input[placeholder="Number"]').should('have.value', updatedEstimation).clear();
		closeIssueWindow();

		clickOnCreatedIssue();
		cy.get('input[placeholder="Number"]').should('not.have.value');
		closeIssueWindow();
		visibleIssueList();
	});


	it('Should be able to cover time-logging functionality', () => {
		cy.get('input[placeholder="Number"]').click().type(originalEstimation);
		cy.contains('Original Estimate (hours)').click();
		cy.get('[data-testid="icon:stopwatch"]').siblings().contains('10h estimated');
		cy.get('[data-testid="icon:stopwatch"]').should('be.visible').click();

		cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
			cy.get('input[placeholder="Number"]').eq(0).should('not.have.value');
			cy.get('input[placeholder="Number"]').eq(0).type(2);
			cy.get('input[placeholder="Number"]').eq(0).should('have.value', 2);
			cy.get('input[placeholder="Number"]').eq(1).should('not.have.value');
			cy.get('input[placeholder="Number"]').eq(1).type(5);
			cy.get('input[placeholder="Number"]').eq(1).should('have.value', 5);
			cy.get('button').should('contain', 'Done').click();
		});

		cy.get('[data-testid="modal:tracking"]').should('not.exist');
		IssueDetailsExist();
		cy.get('[data-testid="icon:stopwatch"]').siblings().contains('2h logged').next().contains('5h remaining');
		cy.get('[data-testid="icon:close"]').eq(0).click();
		cy.get('[data-testid="board-list:backlog').should('be.visible');
		cy.get('[data-testid="list-issue"]').contains(title).click();
		cy.get('[data-testid="icon:stopwatch"]').should('be.visible').click();

		cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
			cy.get('[data-testid="icon:stopwatch"]').siblings().contains('2h logged').next().contains('5h remaining');
			cy.get('input[placeholder="Number"]').eq(0).clear();
			cy.get('input[placeholder="Number"]').eq(1).clear();
			cy.contains('No time logged');
			cy.contains('10h estimated');
			cy.get('button').should('contain', 'Done').click();
		});
		IssueDetailsExist();
		cy.get('input[placeholder="Number"]').should('have.value', 10);
		cy.get('[data-testid="icon:close"]').eq(0).click();
		visibleIssueList();
	});
});
