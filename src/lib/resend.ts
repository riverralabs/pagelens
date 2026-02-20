import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'PageLens <noreply@pagelens.ai>',
    to: email,
    subject: 'Welcome to PageLens!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Welcome to PageLens!</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Thanks for signing up! You're ready to start analyzing your websites with AI-powered insights.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Create a project and add your website URL</li>
          <li>Run an AI-powered analysis across 6 dimensions</li>
          <li>Get detailed reports with actionable recommendations</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Go to Dashboard</a>
        <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">— The PageLens Team</p>
      </div>
    `,
  });
}

export async function sendAnalysisCompleteEmail(email: string, projectName: string, overallScore: number, analysisId: string) {
  await resend.emails.send({
    from: 'PageLens <noreply@pagelens.ai>',
    to: email,
    subject: `Your PageLens analysis for ${projectName} is ready!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Analysis Complete!</h1>
        <p>Your analysis for <strong>${projectName}</strong> is ready.</p>
        <div style="background: #F3F4F6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #6B7280; margin: 0;">Overall Score</p>
          <p style="font-size: 48px; font-weight: bold; color: ${overallScore >= 80 ? '#10B981' : overallScore >= 60 ? '#F59E0B' : '#F43F5E'}; margin: 8px 0;">${overallScore}/100</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/projects/${analysisId}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Full Report</a>
        <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">— The PageLens Team</p>
      </div>
    `,
  });
}
