import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'

type OrderItem = {
  name: string
  imageUrl?: string
}

type OrderConfirmationEmailProps = {
  name?: string
  items: OrderItem[]
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
          <Heading style={heading}>Order Confirmed</Heading>
          <Text style={paragraph}>
            Hi{name ? ` ${name}` : ''}! Your order has been confirmed.
            Here's what you purchased:
          </Text>

          <Section style={itemsContainer}>
            {items.map((item) => (
              <Row key={item.name} style={itemRow}>
                {item.imageUrl && (
                  <Column style={imageColumn}>
                    <Img
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      style={thumbnail}
                    />
                  </Column>
                )}
                <Column style={nameColumn}>
                  <Text style={itemName}>{item.name}</Text>
                </Column>
              </Row>
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
            Thank you for your purchase — enjoy!
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#ffffff', fontFamily: 'sans-serif' }
const container = { maxWidth: '520px', margin: '0 auto', padding: '40px 20px' }
const heading = {
  fontSize: '28px', fontWeight: 900,
  textTransform: 'uppercase' as const,
  letterSpacing: '-0.02em', color: '#111',
}
const paragraph = { color: '#555', lineHeight: '1.6', fontSize: '16px' }
const itemsContainer = { margin: '16px 0' }
const itemRow = {
  borderLeft: '3px solid #e8175d',
  backgroundColor: '#f9f9f9',
  marginBottom: '8px',
  padding: '12px',
}
const imageColumn = { width: '76px', verticalAlign: 'middle' as const }
const nameColumn = { verticalAlign: 'middle' as const, paddingLeft: '12px' }
const thumbnail = {
  borderRadius: '4px',
  objectFit: 'cover' as const,
}
const itemName = { color: '#111', fontSize: '16px', fontWeight: 600, margin: 0 }
const buttonContainer = { marginTop: '24px' }
const button = {
  display: 'inline-block', backgroundColor: '#e8175d', color: '#ffffff',
  padding: '12px 24px', textDecoration: 'none', fontSize: '12px',
  textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontWeight: 700,
}
const footer = { marginTop: '32px', fontSize: '14px', color: '#999' }