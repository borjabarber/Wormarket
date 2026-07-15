import { ListingForm } from '../../../../features/listings/components/listing-form';

type EditListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { slug } = await params;

  return <ListingForm mode="edit" slug={slug} />;
}
