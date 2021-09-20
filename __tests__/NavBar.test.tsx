/**
 * @jest-environment jsdom
 */
  import { render, screen, cleanup } from '@testing-library/react'
  import '@testing-library/jest-dom/extend-expect'
  // 操作をシュミレーションさせる
  import userEvent from '@testing-library/user-event'
  import { getPage, initTestHelpers } from 'next-page-tester'
  import { setupServer } from 'msw/node'
  import { handlers } from '../mock/handlers'
  // import 'setimmediate'
  process.env.NEXT_PUBLIC_HASURA_URL = 'https://basic-lesson-hasura2.hasura.app/v1/graphql'
  
  initTestHelpers() // 初期化

  const server = setupServer(...handlers) // mock-serverを立てる

  beforeAll(() => {
    server.listen()
  })
  // 各テストケースが終わるたびに、resetとclean-upさせる
  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })
  // 全てのテストが終わったら終了させる
  afterAll(() => {
    server.close()
  })

describe('Navigation Test Cases', () => {
  it('Should route to selected page in navbar', async () => {
    const { page } = await getPage({
      route: '/',
    })
    render(page) // 遷移
    // 遷移を確認
    expect(await screen.findByText('Next.js + GraphQL')).toBeInTheDocument()
    // Linkタグのtest-idに'makevar-nav'を埋めていたものをclickさせる
    userEvent.click(screen.getByTestId('makevar-nav'))
    // 遷移先に'makeVar'というテキストを確認
    expect(await screen.findByText('makeVar')).toBeInTheDocument()
    // 以下、同様に各リンクの確認
    userEvent.click(screen.getByTestId('fetchpolicy-nav'))
    expect(await screen.findByText('Hasura main page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('crud-nav'))
    expect(await screen.findByText('Hasura CRUD')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('ssg-nav'))
    expect(await screen.findByText('SSG+ISR')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('memo-nav'))
    expect(await screen.findByText('Custom Hook + useCallback + memo')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('home-nav'))
    expect(await screen.findByText('Next.js + GraphQL')).toBeInTheDocument()
  })
})