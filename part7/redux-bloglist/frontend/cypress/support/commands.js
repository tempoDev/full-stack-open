// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const baseURL = 'http://localhost:3001'

Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', `${baseURL}/api/login`, { username, password })
    .then( response => {
      window.localStorage.setItem('blogAppUser', JSON.stringify(response.body))
      cy.visit('http://localhost:5173/')
    })
})

Cypress.Commands.add('createNewBlog', (blog, user) => {

  cy.request({
    'url': `${baseURL}/api/blogs`,
    'method': 'POST',
    'body': { ...blog },
    'headers': {
      'Authorization': `Bearer ${user.token}`
    }
  })
  cy.visit('http://localhost:5173/')
})