describe('Issue details editing', () => {
	beforeEach(() => {
	  cy.visit('/');
	  cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
			cy.visit(url + '/board');
			cy.contains('This is an issue of type: Task.').click();
	  });
	});
	it('Should update type, status, assignees, reporter, priority successfully', () => {
	  getIssueDetailsModal().within(() => {
			cy.get('[data-testid="select:type"]').click('bottomRight');
			cy.get('[data-testid="select-option:Story"]')
				.trigger('mouseover')
				.trigger('click');
			cy.get('[data-testid="select:type"]').should('contain', 'Story');
			cy.get('[data-testid="select:status"]').click('bottomRight');
			cy.get('[data-testid="select-option:Done"]').click();
			cy.get('[data-testid="select:status"]').should('have.text', 'Done');
			cy.get('[data-testid="select:assignees"]').click('bottomRight');
			cy.get('[data-testid="select-option:Lord Gaben"]').click();
			cy.get('[data-testid="select:assignees"]').click('bottomRight');
			cy.get('[data-testid="select-option:Baby Yoda"]').click();
			cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
			cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');
			cy.get('[data-testid="select:reporter"]').click('bottomRight');
			cy.get('[data-testid="select-option:Pickle Rick"]').click();
			cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');
			cy.get('[data-testid="select:priority"]').click('bottomRight');
			cy.get('[data-testid="select-option:Medium"]').click();
			cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
	  });
	});
	it('Should update title, description successfully', () => {
	  const title = 'TEST_TITLE';
	  const description = 'TEST_DESCRIPTION';
	  getIssueDetailsModal().within(() => {
			cy.get('textarea[placeholder="Short summary"]')
		  .clear()
		  .type(title)
		  .blur();
			cy.get('.ql-snow')
		  .click()
		  .should('not.exist');
			cy.get('.ql-editor').clear().type(description);
			cy.contains('button', 'Save')
		  .click()
		  .should('not.exist');
			cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
			cy.get('.ql-snow').should('have.text', description);
	  });
	});
	const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});
it('Should validate values in issue priorities ', () => {
	  const expectedLength = 5;
	  const allPriorityOptions = ['Lowest', 'Low', 'Medium', 'High','Highest'];
	  const priorityOptions = [];
	  const selectedPriority = () => cy.get('[data-testid="select:priority"]');
	selectedPriority().click();
	selectedPriority().each((option) => {
	  cy.wrap(option).invoke('text').then((text) => {
			priorityOptions.push(text);
		})
	  .then(() => {
	  expect(priorityOptions).to.have.lengthOf(expectedLength);
	  expect(priorityOptions).to.deep.equal(allPriorityOptions);
	  });
	});
	it('Should check that the reporter s name has only characters in it ' , () => {
	  const reporterName = () => cy.get('[data-testid="select:reporter"]');
	  reporterName.click();
	  reporterName.invoke('text').then((text) => {
	  const regex = '/^[A-Za-z\s]+$/';
	  const isNameValid = regex.test(text);
	  expect(isNameValid).to.equal(true);
	  });
	});
	it('Should remove unnecessary spaces on the board view ' , () => {
	  const title = faker.lorem.sentence(5).trim();
	  const description = faker.lorem.sentence(10);
	  cy.get('[data-testid="icon:close"]').click();
	  cy.get('[data-testid="icon:plus"]').click();
	  cy.get('[data-testid="modal:issue-create"]').within(() => {     
			cy.get('.ql-editor').type(description);
			cy.get('input[name="title"]').type(title);
			cy.get('button[type="submit"]').click();
	  });
	  cy.get('[data-testid="board-title"]').should('have.text', title);
	});
});
