const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByText(`${title} ${author}`)).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Arto Hellas',
        username: 'arto',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByTestId('logged-user')).toHaveText(/Matti Luukkainen logged in/)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Playwright testing',
        'Test Author',
        'https://example.com/playwright'
      )

      await expect(page.getByText('Playwright testing Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'Like testing',
        'Test Author',
        'https://example.com/like'
      )

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      await createBlog(
        page,
        'Delete testing',
        'Test Author',
        'https://example.com/delete'
      )

      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Delete testing Test Author')).not.toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page }) => {
      await createBlog(
        page,
        'Creator only delete',
        'Test Author',
        'https://example.com/creator'
      )

      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'arto', 'salainen')

      await page.getByText('Creator only delete Test Author').locator('..').getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      await createBlog(page, 'First blog', 'Author One', 'https://example.com/first')
      await createBlog(page, 'Second blog', 'Author Two', 'https://example.com/second')
      await createBlog(page, 'Third blog', 'Author Three', 'https://example.com/third')

      const firstBlog = page.locator('.blog').filter({ hasText: 'First blog' })
      const secondBlog = page.locator('.blog').filter({ hasText: 'Second blog' })
      const thirdBlog = page.locator('.blog').filter({ hasText: 'Third blog' })

      await firstBlog.getByRole('button', { name: 'view' }).click()
      await secondBlog.getByRole('button', { name: 'view' }).click()
      await thirdBlog.getByRole('button', { name: 'view' }).click()

      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog).toContainText('likes 1')

      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog).toContainText('likes 1')

      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog).toContainText('likes 2')

      await expect(page.locator('.blog').nth(0)).toContainText('Third blog')
      await expect(page.locator('.blog').nth(1)).toContainText('Second blog')
      await expect(page.locator('.blog').nth(2)).toContainText('First blog')
    })
  })
})