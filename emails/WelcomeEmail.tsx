import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type WelcomeEmailProps = {
  name?: string
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Studio Mitsch</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Welcome{name ? `, ${name}` : ''}!
          </Heading>
          <Text style={paragraph}>
            Thanks for subscribing to Studio Mitsch. I'll send occasional
            updates on projects and new work.
          </Text>
          <Text style={paragraph}>
            In the meantime, feel free to explore the site or reach out if
            you have a project in mind.
          </Text>
          <Section style={buttonContainer}>
            <Link href="https://studio-mitsch.de" style={button}>
              Visit Studio Mitsch
            </Link>
          </Section>
          <Text style={footer}>
            Don't want to hear from me?{' '}
            <Link
              href="https://studio-mitsch.de/api/newsletter/unsubscribe"
              style={footerLink}
            >
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'sans-serif',
}

const container = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '40px 20px',
}

const heading = {
  fontSize: '32px',
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  letterSpacing: '-0.02em',
  color: '#111',
}

const paragraph = {
  color: '#555',
  lineHeight: '1.6',
  fontSize: '16px',
}

const buttonContainer = {
  marginTop: '24px',
}

const button = {
  display: 'inline-block',
  backgroundColor: '#e8175d',
  color: '#ffffff',
  padding: '12px 24px',
  textDecoration: 'none',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  fontWeight: 700,
}

const footer = {
  marginTop: '32px',
  fontSize: '12px',
  color: '#999',
}

const footerLink = {
  color: '#999',
}