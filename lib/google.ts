import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/api/auth/callback`
);

export function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/analytics.readonly',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
}

export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function getOAuthClient(tokens: any) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials(tokens);
  return client;
}

export async function getAccessToken(refreshToken: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  return credentials.access_token;
}

export async function fetchGA4Data(accessToken: string, propertyId: string, startDate: string, endDate: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const response = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      dimensions: [{ name: 'date' }],
    },
  });

  return response.data;
}

export async function fetchGA4Countries(accessToken: string, propertyId: string, startDate: string, endDate: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const response = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'country' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: '10',
    },
  });

  return response.data;
}

export async function fetchGA4Properties(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth });
  const response = await analyticsAdmin.accountSummaries.list();

  console.log('GA4 API Response:', JSON.stringify(response.data, null, 2));

  const properties: any[] = [];
  
  for (const account of (response.data.accountSummaries || [])) {
    for (const property of (account.propertySummaries || [])) {
      const propertyId = property.property?.replace('properties/', '') || '';
      console.log('Property:', property);
      properties.push({
        id: propertyId,
        name: property.displayName || 'Unknown',
        accountName: account.displayName || 'Unknown',
        url: '', 
      });
    }
  }

  return properties;
}
