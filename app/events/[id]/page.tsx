import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import Image from "next/image";

export default async function EventDetail(props: any) {
  const params = props?.params || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let event: any = null;
  try {
    const res = await fetch(`${apiUrl}/events/${params.id}`);
    if (res.ok) {
      const json = await res.json();
      event = json.event;
    }
  } catch (e) {
  }

  if (!event) {
    return (
      <PageLayout>
        <div className="py-20 text-center">Event not found.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHero title={event.title} subtitle={event.description} breadcrumb={event.title} backgroundImage={event.images && event.images[0] ? event.images[0] : "/assets/gallery-festival-2.jpg"} />
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card rounded-2xl p-6">
            <h1 className="font-heading text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground mb-4">{new Date(event.date).toLocaleString()}</p>
            {event.images && event.images[0] && <div className="w-full h-72 relative mb-4"><Image src={event.images[0]} alt={event.title} fill className="object-cover rounded-lg"/></div>}
            <p className="mb-6">{event.description}</p>

            {
}
            <EventRegistrationForm eventId={event._id || params.id} formSchema={event.registrationForm} event={event} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
