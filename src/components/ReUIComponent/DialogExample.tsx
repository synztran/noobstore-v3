import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./Dialog";
import { Button } from "./Button";

// Basic Dialog Example
export function BasicDialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

// Controlled Dialog Example
export function ControlledDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Open Controlled Dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog's state is controlled by React state. You can open
                and close it programmatically.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                Dialog is currently: <strong>{open ? "Open" : "Closed"}</strong>
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close Programmatically
              </Button>
              <DialogClose asChild>
                <Button variant="default">Close with DialogClose</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

// Custom Styled Dialog Example
export function CustomStyledDialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Custom Styled Dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop blur="lg" />
        <DialogViewport>
          <DialogContent
            size="xl"
            rounded="2xl"
            className="bg-linear-to-br from-blue-50 to-indigo-100 border-blue-200"
            showClose={false}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-900">
                Custom Styled Dialog
              </DialogTitle>
              <DialogDescription className="text-blue-700">
                This dialog has custom styling with gradients, larger size, and
                rounded corners.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-white/50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Custom background gradient</li>
                  <li>• Extra large size</li>
                  <li>• Rounded corners</li>
                  <li>• Heavy backdrop blur</li>
                  <li>• Hidden close button</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

// Form Dialog Example
export function FormDialogExample() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Contact Form</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Contact Us</DialogTitle>
              <DialogDescription>
                Send us a message and we'll get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Send Message</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

// All Examples Component
export function DialogExamples() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-6">Dialog Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Basic Dialog</h3>
          <BasicDialogExample />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Controlled Dialog</h3>
          <ControlledDialogExample />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Custom Styled</h3>
          <CustomStyledDialogExample />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Form Dialog</h3>
          <FormDialogExample />
        </div>
      </div>
    </div>
  );
}
