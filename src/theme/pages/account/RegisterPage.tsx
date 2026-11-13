import { AuthFrame } from '../../components/AuthFrame'
import { SignInView } from '../../components/interactive/SignInView'
import { Layout } from '../../components/Layout'

export const RegisterPage = () => (
  <Layout>
    <AuthFrame>
      <SignInView purpose="register" />
    </AuthFrame>
  </Layout>
)
