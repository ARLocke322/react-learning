const { test, expect, describe, beforeEach } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'tester',
                username: 'test',
                password: 'testpassword'
            }
        })
        await request.post('/api/users', {
            data: {
                name: 'tester2',
                username: 'test2',
                password: 'testpassword2'
            }
        })
        await page.goto('/')
    })
    test('front page can be opened', async ({ page }) => {
        const locator = page.getByText('Blog App')
        await expect(locator).toBeVisible()
    })

    test('user can log in with correct credentials', async ({ page }) => {

        loginWith(page, 'test', 'testpassword')

        await expect(page.getByText('tester logged in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
        loginWith(page, 'test', 'wrong')

        await expect(page.getByText('wrong credentials')).toBeVisible()

        await expect(page.getByText('tester logged in')).not.toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            loginWith(page, 'test', 'testpassword')
        })

        test('a new note can be created', async ({ page }) => {
            await createBlog(page, 'a note created by playwright', 'playwright', 'playwright.com')
            const blogSummary = page.getByTestId('blog-summary')
            await expect(blogSummary).toContainText('a note created by playwright playwright')
        })

        describe('and several notes exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'first blog', 'test1', 'test1.com')
                await page.waitForTimeout(500);
                await createBlog(page, 'second blog', 'test2', 'test2.com')
                await page.waitForTimeout(500);
                await createBlog(page, 'third blog', 'test3', 'test3.com')
                await page.waitForTimeout(500);
            })

            test('one of those can be liked', async ({ page }) => {
                const blogElement = page.locator('[data-testid="blog-summary"]:has-text("first blog")')
                await blogElement.getByRole('button', { name: 'view' }).click()

                // Now work within the expanded blog details
                const blogDetails = page.locator('[data-testid="blog-details"]:has-text("first blog")')

                // Click the like button
                await blogDetails.getByRole('button', { name: 'like' }).click()

                // Check that likes increased to 1
                await expect(blogDetails.locator('p:has-text("like")').getByText('1')).toBeVisible()
            })

            test('one can be deleted', async ({ page }) => {
                page.on('dialog', dialog => dialog.accept())

                const blogElement = page.locator('[data-testid="blog-summary"]:has-text("first blog")')
                await blogElement.getByRole('button', { name: 'view' }).click()

                // Now work within the expanded blog details
                const blogDetails = page.locator('[data-testid="blog-details"]:has-text("first blog")')

                // Click the like button
                await blogDetails.getByRole('button', { name: 'delete' }).click()

                const blogSummary = page.getByTestId('blog-summary')
                await expect(page.locator('[data-testid="blog-summary"]:has-text("first blog")')).not.toBeVisible()
            })

            test('other user cannot see the delete button', async ({ page }) => {
                await page.getByRole('button', { name: 'logout' }).click()
                await loginWith(page, 'test2', 'testpassword2')

                const blogElement = page.locator('[data-testid="blog-summary"]:has-text("first blog")')
                await blogElement.getByRole('button', { name: 'view' }).click()

                // Now work within the expanded blog details
                const blogDetails = page.locator('[data-testid="blog-details"]:has-text("first blog")')
                await expect(blogDetails.getByRole('button', { name: 'delete' })).not.toBeVisible()

            })

            test('blogs are arranged in order according to likes', async ({ page }) => {

                const blog1Element = page.locator('[data-testid="blog-summary"]:has-text("first blog")')
                await blog1Element.getByRole('button', { name: 'view' }).click()
                await page.waitForTimeout(100)
                const blog1Details = page.locator('[data-testid="blog-details"]:has-text("first blog")')
                await blog1Details.getByRole('button', { name: 'like' }).click()
                await page.waitForTimeout(100)
                await blog1Details.getByRole('button', { name: 'hide' }).click()
                await page.waitForTimeout(100)
                await page.waitForTimeout(500);
                const blogSummaries = page.locator('[data-testid="blog-summary"]')

                await expect(blogSummaries.nth(0)).toContainText('first blog')
                await expect(blogSummaries.nth(1)).toContainText('second blog')
                await expect(blogSummaries.nth(2)).toContainText('third blog')

                const blog2Element = page.locator('[data-testid="blog-summary"]:has-text("second blog")')
                await blog2Element.getByRole('button', { name: 'view' }).click()
                await page.waitForTimeout(100)
                const blog2Details = page.locator('[data-testid="blog-details"]:has-text("second blog")')
                await blog2Details.getByRole('button', { name: 'like' }).click()
                await page.waitForTimeout(100)
                await blog2Details.getByRole('button', { name: 'like' }).click()
                await page.waitForTimeout(100)
                await blog2Details.getByRole('button', { name: 'hide' }).click()
                await page.waitForTimeout(100)
                await page.waitForTimeout(500);
                // order is 213
                const blogSummaries2 = page.locator('[data-testid="blog-summary"]')

                await expect(blogSummaries2.nth(0)).toContainText('second blog')
                await expect(blogSummaries2.nth(1)).toContainText('first blog')
                await expect(blogSummaries2.nth(2)).toContainText('third blog')

                const blog3Element = page.locator('[data-testid="blog-summary"]:has-text("third blog")')
                await blog3Element.getByRole('button', { name: 'view' }).click()
                await page.waitForTimeout(100)
                const blog3Details = page.locator('[data-testid="blog-details"]:has-text("third blog")')
                await blog3Details.getByRole('button', { name: 'like' }).click()
                await page.waitForTimeout(100)
                await blog3Details.getByRole('button', { name: 'like' }).click()
                await page.waitForTimeout(100)
                await blog3Details.getByRole('button', { name: 'like' }).click()
                await page.waitForTimeout(100)
                await blog3Details.getByRole('button', { name: 'hide' }).click()
                await page.waitForTimeout(500);
                //order is 321
                const blogSummaries3 = page.locator('[data-testid="blog-summary"]')

                await expect(blogSummaries3.nth(0)).toContainText('third blog')
                await expect(blogSummaries3.nth(1)).toContainText('second blog')
                await expect(blogSummaries3.nth(2)).toContainText('first blog')
            })
        })
    })
})