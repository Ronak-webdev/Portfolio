import { useState, FormEvent, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Copy, Check, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { PERSONAL_INFO } from "../data";
import { synth, NOTES } from "./AmbientSound";

const Contact = memo(function Contact() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    synth.playNote(NOTES.success[2], "sine", 0.2);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    synth.playNote(NOTES.click[3], "sine", 0.15);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      synth.playChord([261.63, 329.63, 392.0], "sine");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 4500);
    }, 1200);
  };

  const channels = [
    {
      id: "email",
      icon: Mail,
      label: "Email",
      value: PERSONAL_INFO.email,
      href: `mailto:${PERSONAL_INFO.email}`,
      copyValue: PERSONAL_INFO.email,
    },
    {
      id: "whatsapp",
      icon: MessageSquare,
      label: "WhatsApp",
      value: PERSONAL_INFO.whatsapp,
      href: `https://wa.me/${PERSONAL_INFO.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`,
      copyValue: PERSONAL_INFO.whatsapp,
    },
    {
      id: "phone",
      icon: Phone,
      label: "Phone",
      value: PERSONAL_INFO.phone,
      href: `tel:${PERSONAL_INFO.phone.replace(/\s/g, "")}`,
      copyValue: PERSONAL_INFO.phone,
    },
  ];

  return (
    <section id="contact" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-[2px] bg-purple-600" />
              <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Collaborations</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-neutral-900">
              Get In Touch
            </h3>
          </div>
          <p className="text-neutral-500 max-w-md text-sm font-sans leading-relaxed">
            Interested in internships, AI/ML research collaborations, or full-stack software development? Let's connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Left Column: Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            style={{ willChange: "transform, opacity" }}
            className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 sm:p-7 flex flex-col"
          >
            <h4 className="text-sm font-bold text-neutral-900 mb-5">
              Contact Information
            </h4>

            <div className="space-y-1 flex-1">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <ch.icon className="w-4 h-4" />
                  </div>
                  <a
                    href={ch.href}
                    target={ch.id === "whatsapp" ? "_blank" : undefined}
                    referrerPolicy="no-referrer"
                    className="flex-1 min-w-0"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">{ch.label}</p>
                    <p className="text-sm text-neutral-800 font-medium truncate group-hover:text-purple-600">{ch.value}</p>
                  </a>
                  <button
                    onClick={() => copyToClipboard(ch.copyValue, ch.id)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors shrink-0"
                    title={`Copy ${ch.label}`}
                  >
                    {copiedField === ch.id ? (
                      <Check className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Location</p>
                  <p className="text-sm text-neutral-800 font-medium truncate">{PERSONAL_INFO.location}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-4 pt-5 border-t border-neutral-100 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900">Open to opportunities</span> — internships & research roles
              </p>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ willChange: "transform, opacity" }}
            className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 sm:p-7"
          >
            <h4 className="text-sm font-bold text-neutral-900 mb-1">
              Send a Message
            </h4>
            <p className="text-xs text-neutral-500 mb-6">
              I typically respond within 24–48 hours.
            </p>

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center justify-center text-center py-14"
                >
                  <CheckCircle2 className="w-10 h-10 text-purple-600 mb-4" />
                  <p className="text-sm font-semibold text-neutral-900">Message sent</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Thanks for reaching out — I'll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5 font-medium">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1.5 font-medium">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@company.com"
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5 font-medium">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about the role, project, or idea you'd like to discuss..."
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 text-white font-semibold text-sm h-12 rounded-lg transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="text-sm">Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default Contact;
