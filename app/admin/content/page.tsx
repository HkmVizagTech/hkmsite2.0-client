"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, X, FileText, Globe, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function AdminContent() {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [heroContent, setHeroContent] = useState({
    title: "Hare Krishna Movement",
    subtitle: "Visakhapatnam",
    tagline: "Spreading the timeless message of Lord Krishna through devotion, service, and community",
  });

  const [aboutContent, setAboutContent] = useState({
    title: "About Our Movement",
    description: "The Hare Krishna Movement Vizag is dedicated to spreading the teachings of Lord Sri Krishna as presented by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Through temple worship, community service, and spiritual education, we strive to create a God-conscious society.",
    mission: "To systematically propagate spiritual knowledge to society at large and to educate all people in the techniques of spiritual life.",
  });

  const [contactInfo, setContactInfo] = useState({
    phone: "+91 98765 43210",
    email: "info@harekrishnavizag.org",
    address: "Hare Krishna Movement, Visakhapatnam, Andhra Pradesh, India - 530003",
    timings: "4:30 AM – 8:30 PM",
  });

  const [scheduleItems, setScheduleItems] = useState([
    { time: "4:30 AM", activity: "Mangala Aarti" },
    { time: "5:00 AM", activity: "Tulasi Puja" },
    { time: "7:15 AM", activity: "Guru Puja" },
    { time: "7:30 AM", activity: "Srimad Bhagavatam Class" },
    { time: "12:30 PM", activity: "Raj Bhog Aarti" },
    { time: "4:30 PM", activity: "Sandhya Aarti" },
    { time: "7:00 PM", activity: "Gaura Aarti" },
    { time: "8:15 PM", activity: "Shayan Aarti" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">Edit all website content from one place</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {
}
        <TabsContent value="hero">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Hero Section</CardTitle>
              {editingSection === "hero" ? (
                <div className="flex gap-2">
                  <Button onClick={() => setEditingSection(null)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("hero")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input value={heroContent.title} disabled={editingSection !== "hero"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroContent({ ...heroContent, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subtitle</label>
                <Input value={heroContent.subtitle} disabled={editingSection !== "hero"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroContent({ ...heroContent, subtitle: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tagline</label>
                <Textarea value={heroContent.tagline} disabled={editingSection !== "hero"} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHeroContent({ ...heroContent, tagline: e.target.value })} rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
}
        <TabsContent value="about">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> About Section</CardTitle>
              {editingSection === "about" ? (
                <div className="flex gap-2">
                  <Button onClick={() => setEditingSection(null)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("about")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input value={aboutContent.title} disabled={editingSection !== "about"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAboutContent({ ...aboutContent, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea value={aboutContent.description} disabled={editingSection !== "about"} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAboutContent({ ...aboutContent, description: e.target.value })} rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mission</label>
                <Textarea value={aboutContent.mission} disabled={editingSection !== "about"} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAboutContent({ ...aboutContent, mission: e.target.value })} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
}
        <TabsContent value="contact">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" /> Contact Info</CardTitle>
              {editingSection === "contact" ? (
                <div className="flex gap-2">
                  <Button onClick={() => setEditingSection(null)}><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("contact")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</label>
                  <Input value={contactInfo.phone} disabled={editingSection !== "contact"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactInfo({ ...contactInfo, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
                  <Input value={contactInfo.email} disabled={editingSection !== "contact"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactInfo({ ...contactInfo, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Address</label>
                <Textarea value={contactInfo.address} disabled={editingSection !== "contact"} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContactInfo({ ...contactInfo, address: e.target.value })} rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Timings</label>
                <Input value={contactInfo.timings} disabled={editingSection !== "contact"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactInfo({ ...contactInfo, timings: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Daily Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                    <Input value={item.time} onChange={(e) => {
                      const updated = [...scheduleItems];
                      updated[i].time = e.target.value;
                      setScheduleItems(updated);
                    }} className="w-28" />
                    <Input value={item.activity} onChange={(e) => {
                      const updated = [...scheduleItems];
                      updated[i].activity = e.target.value;
                      setScheduleItems(updated);
                    }} className="flex-1" />
                    <Button className="p-2 h-auto bg-transparent text-destructive hover:bg-destructive/10" onClick={() => setScheduleItems(scheduleItems.filter((_, j) => j !== i))}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full bg-transparent border border-dashed border-border text-muted-foreground hover:bg-muted" onClick={() => setScheduleItems([...scheduleItems, { time: "", activity: "" }])}>
                  + Add Schedule Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
