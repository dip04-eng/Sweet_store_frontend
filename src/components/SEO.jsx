import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title,
  description,
  keywords,
  image = 'https://sweet-store-frontend-ten.vercel.app/Background.png',
  url,
  type = 'website',
  structuredData = null,
  noindex = false
}) => {
  const siteUrl = 'https://sweet-store-frontend-ten.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const siteName = 'Mansoor Hotel & Sweets';
  
  const defaultTitle = 'Mansoor Hotel & Sweets - Best Traditional Sweets Shop in Baisi, Bihar | Since 1976';
  const defaultDescription = 'Order authentic Indian sweets online from Mansoor Hotel & Sweets, Baisi, Bihar. Family-owned since 1976. 100+ varieties of handcrafted sweets made with pure ghee & finest ingredients.';
  const defaultKeywords = 'Mansoor Hotel, Mansoor Sweets, Baisi Sweets, Bihar Sweets, Traditional Indian Sweets, Sweet Shop Baisi, Online Sweet Order';

  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
