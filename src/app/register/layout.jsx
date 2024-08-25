

export const metadata = {
    title: 'Register | xipplg2-7.vercel.app',
    description: 'Sign up for an account at xipplg2-7.vercel.app and join the community.',
    generator: 'Next.js',
    applicationName: 'xipplg2-7.vercel.app',
    referrer: 'origin-when-cross-origin',
    keywords: ['xipplg2-7', 'Register', 'Next.js', 'React'],
    authors: [{ name: 'Your Name' }],
    creator: 'Your Name',
    publisher: 'xipplg2-7.vercel.app',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
  

export default function layout({ children }) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }