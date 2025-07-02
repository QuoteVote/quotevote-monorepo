/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-commented-out-tests */
import '@testing-library/cypress/add-commands'

describe('Login', () => {
  const username = Cypress.env('test_username')
  const password = Cypress.env('test_password')
  const rootUrl = `${Cypress.env('root_url')}/auth/login`

  beforeEach(() => {
    cy.visit(rootUrl)
  })

  it('has username and password field', () => {
    cy.findByPlaceholderText('Email/Username').should('exist')
    cy.findByPlaceholderText('Password').should('exist')
  })

  it('can login with test account', () => {
    cy.findByPlaceholderText('Email/Username').type(username)
    cy.findByPlaceholderText('Password').type(password)
    cy.findByText('Log in').click()
    // cy.url().should('include', '/profile/hhsb/avatar')
  })

  // it('should display error message if wrong credentials', () => {
  //   cy.findByPlaceholderText('Username').type('invalid')
  //   cy.findByPlaceholderText('Password').type('invalid')
  //   cy.findByText('Log in').click()
  //   cy.findByText('Invalid username or password.').should('exist')
  // })
})
