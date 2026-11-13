import { AuthFrame } from '../../components/AuthFrame'
import { SignInView } from '../../components/interactive/SignInView'
import { Layout } from '../../components/Layout'

export const SignInPage = () => (
  <Layout>
    <AuthFrame>
      <SignInView purpose="signIn" />
    </AuthFrame>
  </Layout>
)
