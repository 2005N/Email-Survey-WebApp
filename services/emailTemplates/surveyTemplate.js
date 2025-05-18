const keys = require('../../config/keys');

module.exports = (survey) => {
  return `
    <html>
      <head>
        <style>
          /* Base styles (light mode) */
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background-color:rgba(211, 224, 255, 0.98);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            padding: 40px 30px 20px 30px;
            text-align: center;
            background-color: #1976d2;
            color: #ffffff;
          }
          .body {
            padding: 30px;
            text-align: center;
            color: #333333;
          }
          .footer {
            padding: 20px;
            font-size: 12px;
            color: #888888;
            text-align: center;
          }
          .button {
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 16px;
            margin: 0 10px;
            display: inline-block;
          }
          .btn-yes {
            background-color: #4caf50;
            color: white;
          }
          .btn-no {
            background-color: #f44336;
            color: white;
          }

          /* Dark mode styles */
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #121212;
            }
            .container {
              background-color: #1e1e1e;
              color: #ffffff;
            }
            .header {
              background-color: #0d47a1;
              color: #ffffff;
            }
            .body {
              color: #dddddd;
            }
            .footer {
              color: #aaaaaa;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>We'd love your feedback!</h2>
          </div>
          <div class="body">
            <p style="font-size: 18px; margin-bottom: 20px;">${survey.body}</p>
            <p style="font-size: 16px;">Please click a button below:</p>
            <div style="margin-top: 30px;">
              <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes" class="button btn-yes">Yes</a>
              <a href="${keys.redirectDomain}/api/surveys/${survey.id}/no" class="button btn-no">No</a>
            </div>
          </div>
          <div class="footer">
            You received this email because you're a user of Emaily.
          </div>
        </div>
      </body>
    </html>
  `;
};
