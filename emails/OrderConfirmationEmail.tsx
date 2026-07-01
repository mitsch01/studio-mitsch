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

type OrderConfirmationEmailProps = {
  name?: string
  items: string[]
  dashboardUrl: string
}

export default function OrderConfirmationEmail({
  name,
  items,
  dashboardUrl,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Studio Mitsch order is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Order Confirmed
          </Heading>
          <Text style={paragraph}>
            Hi{name ? ` ${name}` : ''}! Your order has been confirmed.
            Here's what you purchased:
          </Text>
          <Section style={itemsContainer}>
            {items.map((item) => (
              <Text key={item} style={itemRow}>
                — {item}
              </Text>
            ))}
          </Section>
          <Text style={paragraph}>
            You can download your files anytime from your account dashboard.
          </Text>
          <Section style={buttonContainer}>
            <Link href={dashboardUrl} style={button}>
              Go to My Downloads
            </Link>
          </Section>
          <Text style={footer}>
            Thank you for your purchase — enjoy! 🎨
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
  fontSize: '28px',
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

const itemsContainer = {
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f9f9f9',
  borderLeft: '3px solid #e8175d',
}

const itemRow = {
  color: '#111',
  fontSize: '16px',
  margin: '4px 0',
  fontWeight: 600,
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
  fontSize: '14px',
  color: '#999',
}