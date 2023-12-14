describe('Blogs App', () => {

  beforeEach( function(){
    cy.request('POST', 'http://localhost:3001/api/reset')
    const user = {
      name: 'Tempo Cypress',
      username: 'tempoCy',
      password: 'eltempocy'
    }

    const intrusive = {
      name: 'Tempo intrusive',
      username: 'tempoAnother',
      password: 'eltempocy'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.request('POST', 'http://localhost:3001/api/users', intrusive)
    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown', () => {

    cy.contains('Log in to application')
    cy.contains('username').find('input')
    cy.contains('password').find('input')
    cy.get('form').contains('login')
  })

  describe('LOGIN', function(){

    it('succeeds with correct credential', function(){
      cy.contains('username').find('input').type('tempoCy')
      cy.contains('password').find('input').type('eltempocy')
      cy.get('form').contains('login').click()

      cy.contains('Tempo Cypress logged-in')
    })

    it('fails with wrong credentials', function(){
      cy.contains('username').find('input').type('tempoCy')
      cy.contains('password').find('input').type('upsss')
      cy.get('form').contains('login').click()

      cy.contains('Wrong credentials')
    })

  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('username').find('input').type('tempoCy')
      cy.contains('password').find('input').type('eltempocy')
      cy.get('form').contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('Create a blog').click()
      cy.contains('Title').find('input').type('Test Prueba Cypress')
      cy.contains('Author').find('input').type('Tempo Cy')
      cy.contains('URL').find('input').type('localhost/laprueba')
      cy.get('form').contains('Create').click()

      cy.contains('Blog added!')
    })

    it('a blog can be liked', function(){
      cy.contains('Create a blog').click()
      cy.contains('Title').find('input').type('Test Prueba Cypress')
      cy.contains('Author').find('input').type('Tempo Cy')
      cy.contains('URL').find('input').type('localhost/laprueba')
      cy.get('form').contains('Create').click()

      cy.visit('http://localhost:5173/')

      cy.contains('View').click()
      cy.contains('0 likes')
      cy.get('button').contains('Like').click()
      cy.contains('1 likes')
    })

    it('blogs order by likes', function(){
      cy.contains('Create a blog').click()
      cy.contains('Title').find('input').type('Test que no gusta tanto')
      cy.contains('Author').find('input').type('Tempo Cy')
      cy.contains('URL').find('input').type('localhost/laprueba')
      cy.get('form').contains('Create').click()

      cy.contains('Title').find('input').type('Test que gusta mucho')
      cy.contains('Author').find('input').type('Tempo Cy')
      cy.contains('URL').find('input').type('localhost/laprueba')
      cy.get('form').contains('Create').click()

      cy.visit('http://localhost:5173/')

      cy.get('.blog').eq(1).contains('View').click()
      cy.contains('0 likes')
      cy.get('.blog').eq(1).contains('Like').click()
      cy.contains('1 likes')
      cy.get('.blog').eq(0).contains('Like').click()
      cy.contains('2 likes')
      cy.get('.blog').eq(0).contains('Hide').click()

      cy.get('.blog').eq(1).contains('View').click()
      cy.contains('0 likes')
      cy.get('.blog').eq(1).contains('Like').click()
      cy.contains('1 likes')

      cy.get('.blog').eq(0).should('contain', 'Test que gusta mucho')
      cy.get('.blog').eq(1).should('contain', 'Test que no gusta tanto')
    })
  })

  describe('there are two users', function() {

    beforeEach( function(){
      cy.contains('username').find('input').type('tempoAnother')
      cy.contains('password').find('input').type('eltempocy')
      cy.get('form').contains('login').click()
    })

    it('Only the user creator can remove the blog', function(){
      cy.contains('Create a blog').click()
      cy.contains('Title').find('input').type('Test que gusta mucho')
      cy.contains('Author').find('input').type('Tempo Cy')
      cy.contains('URL').find('input').type('localhost/laprueba')
      cy.get('form').contains('Create').click()
      cy.contains('Logout').click()

      cy.visit('http://localhost:5173/')
      cy.contains('username').find('input').type('tempoCy')
      cy.contains('password').find('input').type('eltempocy')
      cy.get('form').contains('login').click()

      cy.contains('View').click()
      cy.contains('Delete').should('not.exist')
    })
  })
})
