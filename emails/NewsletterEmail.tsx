import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

type NewsletterEmailProps = {
  subject: string
  bodyHtml: string
  unsubscribeEmail: string
}

export default function NewsletterEmail({
  subject,
  bodyHtml,
  unsubscribeEmail,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{subject}</Heading>
          <div
            style={paragraph}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          <Text style={footer}>
            You're receiving this because you subscribed at studio-mitsch.de.{' '}
            <Link
              href={`https://studio-mitsch.de/api/newsletter/unsubscribe?email=${unsubscribeEmail}`}
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

const footer = {
  marginTop: '32px',
  paddingTop: '16px',
  borderTop: '1px solid #eee',
  fontSize: '12px',
  color: '#999',
}

const footerLink = {
  color: '#999',
}