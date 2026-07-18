import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@kite/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formShowcaseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  channel: z.enum(["web", "email", "social"], {
    error: "Select a channel",
  }),
  audience: z.array(z.string()).min(1, "Select at least one audience"),
  priority: z.enum(["low", "medium", "high"], {
    error: "Select a priority",
  }),
  dueDate: z
    .date()
    .optional()
    .refine((date) => date instanceof Date, "Pick a due date"),
  termsAccepted: z
    .boolean()
    .refine((accepted) => accepted, "Confirm before submitting"),
});

type FormShowcaseValues = z.infer<typeof formShowcaseSchema>;

const initialValues: FormShowcaseValues = {
  title: "Launch update",
  summary: "Prepare the workspace announcement for the upcoming launch.",
  channel: "web",
  audience: ["members", "admins"],
  priority: "medium",
  dueDate: new Date(),
  termsAccepted: true,
};

const clearedValues: FormShowcaseValues = {
  title: "",
  summary: "",
  channel: "web",
  audience: [],
  priority: "medium",
  dueDate: undefined,
  termsAccepted: false,
};

const channelOptions = [
  { label: "Web", value: "web" },
  { label: "Email", value: "email" },
  { label: "Social", value: "social" },
];

const audienceOptions = [
  { label: "Members", value: "members" },
  { label: "Admins", value: "admins" },
  { label: "Guests", value: "guests" },
];

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export function DashboardFormSection() {
  const form = useForm<FormShowcaseValues>({
    resolver: zodResolver(formShowcaseSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: FormShowcaseValues) => {
    console.log("Dashboard form values", values);
    form.reset(clearedValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Components</CardTitle>
        <CardDescription>Shared form controls with validation</CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={onSubmit}>
          {({
            FormCheckbox,
            FormDatePicker,
            FormInput,
            FormMultiSelect,
            FormRadioGroup,
            FormSelect,
            FormTextarea,
          }) => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  name="title"
                  label="Title"
                  placeholder="Announcement title"
                />
                <FormSelect
                  name="channel"
                  label="Channel"
                  placeholder="Select a channel"
                  options={channelOptions}
                />
              </div>

              <FormTextarea
                name="summary"
                label="Summary"
                placeholder="Write the message"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormMultiSelect
                  name="audience"
                  label="Audience"
                  placeholder="Select audience"
                  options={audienceOptions}
                />
                <FormDatePicker name="dueDate" label="Due Date" />
              </div>

              <FormRadioGroup
                name="priority"
                label="Priority"
                options={priorityOptions}
              />

              <FormCheckbox
                name="termsAccepted"
                label="Ready to submit"
                description="Validation requires this confirmation."
              />

              <Button type="submit" className="w-full md:w-fit">
                Submit
              </Button>
            </>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
