import { ListingDetail } from '../../../features/listings/components/listing-detail';

type ListingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;

  return <ListingDetail slug={slug} />;
}
