import { AuthFrame } from '../../components/AuthFrame'
import { SignInView } from '../../components/interactive/SignInView'
import { Layout } from '../../components/Layout'

export const ForgotPasswordPage = () => (
  <Layout>
    <AuthFrame>
      <SignInView purpose="reset" />
    </AuthFrame>
  </Layout>
)
