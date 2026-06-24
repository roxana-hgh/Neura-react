import { useState } from 'react';
import type { ChangeEvent } from 'react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import type { FocusSession } from '../../../../types/FocusSession';
import { useFocusSessionStore } from '../../../../stores/focusSessionStore';

interface SessionModalProps {
  session: FocusSession;
  isOpen: boolean;
  onClose: () => void;
}

function SessionModal({ session, isOpen, onClose }: SessionModalProps) {
  const [name, setName] = useState(session.name);
  const [tag, setTag] = useState<'work' | 'personal' | 'study' | 'break' | 'other' | undefined>(
    session.tag
  );
  const [description, setDescription] = useState(session.description || '');
  const updateSession = useFocusSessionStore((state) => state.updateSession) as (
    id: string,
    updates: Partial<FocusSession>
  ) => void;

  const handleSave = () => {
    updateSession(session.id, {
      name,
      tag,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Update the name and details for this focus session.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Session Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Enter session name..."
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              placeholder="What did you work on?"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tag" className="text-sm font-medium">
              Tag (Optional)
            </label>
            <Select value={tag || ''} onValueChange={(value: string) => setTag(value as 'work' | 'personal' | 'study' | 'break' | 'other' | undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="break">Break</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SessionModal;
