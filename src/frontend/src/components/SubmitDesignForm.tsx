import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AppView } from "../App";
import { ExternalBlob, SubmissionStatus } from "../backend";
import { useSubmitDesign } from "../hooks/useQueries";

interface FormData {
  artistName: string;
  email: string;
  title: string;
  description: string;
}

interface SubmitDesignFormProps {
  onNavigate: (view: AppView) => void;
}

export default function SubmitDesignForm({
  onNavigate,
}: SubmitDesignFormProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    artistName: "",
    email: "",
    title: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData & { image: string }>>(
    {},
  );

  const { mutateAsync: submitDesign, isPending } = useSubmitDesign();

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please upload an image file." }));
      return;
    }
    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: undefined }));
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData & { image: string }> = {};
    if (!formData.artistName.trim())
      newErrors.artistName = "Artist name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.title.trim()) newErrors.title = "Design title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!imageFile) newErrors.image = "Please upload a design image.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const bytes = new Uint8Array(await imageFile!.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const submission = {
        artistName: formData.artistName,
        email: formData.email,
        title: formData.title,
        description: formData.description,
        image: blob,
        status: SubmissionStatus.pending,
        isPaid: false,
        timestamp: BigInt(Date.now() * 1_000_000),
      };

      const id = await submitDesign(submission);
      setSubmittedId(id);
      toast.success("Design submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    }
  };

  if (submittedId) {
    return (
      <section className="min-h-screen flex items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
          data-ocid="submit.success_state"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-moss-200/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-moss-100" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            Design Submitted!
          </h2>
          <p className="text-muted-foreground font-body text-sm leading-relaxed mb-2">
            Thank you for your submission. Our team will review your design and
            get in touch.
          </p>
          <p className="text-xs font-body text-muted-foreground/60 mb-8">
            Submission ID:{" "}
            <span className="font-mono text-primary">{submittedId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                setSubmittedId(null);
                setFormData({
                  artistName: "",
                  email: "",
                  title: "",
                  description: "",
                });
                setImageFile(null);
                setImagePreview(null);
                setUploadProgress(0);
              }}
              variant="outline"
              className="border-border font-body tracking-widest uppercase text-xs rounded-none"
              data-ocid="submit.secondary_button"
            >
              Submit Another
            </Button>
            <Button
              onClick={() => onNavigate("gallery")}
              className="bg-primary text-primary-foreground font-body tracking-widest uppercase text-xs rounded-none"
              data-ocid="submit.primary_button"
            >
              View Gallery
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary block mb-4">
            Artist Submissions
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight mb-4">
            Submit Your{" "}
            <span className="font-italic-accent font-normal">Design</span>
          </h2>
          <p className="text-sm font-body text-muted-foreground leading-relaxed max-w-lg">
            Selected designs are featured in BASSET collections and artists
            receive payment. Submit your sustainable fashion concept and join
            the circular fashion movement.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
          data-ocid="submit.modal"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="artistName"
                className="text-xs font-body tracking-widest uppercase text-muted-foreground"
              >
                Artist Name *
              </Label>
              <Input
                id="artistName"
                value={formData.artistName}
                onChange={(e) =>
                  handleFieldChange("artistName", e.target.value)
                }
                placeholder="Your full name"
                className="rounded-none bg-card border-border font-body focus:ring-primary"
                data-ocid="submit.input"
                aria-describedby={
                  errors.artistName ? "artistName-error" : undefined
                }
              />
              {errors.artistName && (
                <p
                  id="artistName-error"
                  className="text-xs text-destructive font-body"
                  data-ocid="submit.error_state"
                >
                  {errors.artistName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-body tracking-widest uppercase text-muted-foreground"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="you@example.com"
                className="rounded-none bg-card border-border font-body"
                data-ocid="submit.input"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-destructive font-body"
                  data-ocid="submit.error_state"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-body tracking-widest uppercase text-muted-foreground"
            >
              Design Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Name your design"
              className="rounded-none bg-card border-border font-body"
              data-ocid="submit.input"
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p
                id="title-error"
                className="text-xs text-destructive font-body"
                data-ocid="submit.error_state"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-body tracking-widest uppercase text-muted-foreground"
            >
              Design Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Describe your design concept, materials used, and inspiration..."
              rows={4}
              className="rounded-none bg-card border-border font-body resize-none"
              data-ocid="submit.textarea"
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {errors.description && (
              <p
                id="description-error"
                className="text-xs text-destructive font-body"
                data-ocid="submit.error_state"
              >
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-body tracking-widest uppercase text-muted-foreground">
              Design Image *
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              id="imageUpload"
            />
            {imagePreview ? (
              <div className="relative border border-border">
                <img
                  src={imagePreview}
                  alt="Design preview"
                  className="w-full max-h-64 object-contain bg-card"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background transition-colors"
                  aria-label="Remove image"
                  data-ocid="submit.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs font-body text-muted-foreground p-2">
                  {imageFile?.name} (
                  {(imageFile!.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-12 cursor-pointer hover:bg-muted transition-colors"
                data-ocid="submit.dropzone"
              >
                <ImageIcon className="w-8 h-8 text-muted-foreground/50 mb-3" />
                <span className="text-sm font-body text-muted-foreground mb-1">
                  Click to upload your design image
                </span>
                <span className="text-xs font-body text-muted-foreground/60">
                  PNG, JPG, WEBP — max 20MB
                </span>
              </label>
            )}
            {errors.image && (
              <p
                className="text-xs text-destructive font-body"
                data-ocid="submit.error_state"
              >
                {errors.image}
              </p>
            )}
          </div>

          {isPending && uploadProgress > 0 && (
            <div className="space-y-2" data-ocid="submit.loading_state">
              <p className="text-xs font-body text-muted-foreground">
                Uploading image... {uploadProgress}%
              </p>
              <Progress value={uploadProgress} className="h-1 rounded-none" />
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body tracking-widest uppercase text-sm rounded-none h-12"
            data-ocid="submit.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploadProgress > 0
                  ? `Uploading... ${uploadProgress}%`
                  : "Submitting..."}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Design
              </>
            )}
          </Button>

          <p className="text-xs font-body text-muted-foreground/60 text-center">
            By submitting, you agree that BASSET may use selected designs in our
            collections. Artists of selected designs receive payment.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
