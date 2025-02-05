"use client";

import {
  Input,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Avatar,
  Slider,
} from "@nextui-org/react";
import { SearchIcon, Undo } from "lucide-react";
import { startTransition, useCallback, useState } from "react";
import { Activity } from "../../../../types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Search from "../search";

interface OrganizerSection {
  id: number;
  name: string;
  avatar: string;
}

interface TargetGroup {
  id: number;
  name: string;
}

interface DifficultyLevel {
  id: number;
  name: string;
}

export default function FilterModal({
  activities,
  allActivites,
  isOpen,
  onOpenChange,
}: {
  activities: Activity[];
  allActivites: Activity[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [organizerFilter, setOrganizerFilter] = useState(new Set());
  const [targetGroupFilter, setTargetGroupFilter] = useState(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState(new Set());
  const [elevationGainRange, setElevationGainRange] = useState([0, 3000]);

  const uniqueOrganizerSections: OrganizerSection[] = Array.from(
    new Set(allActivites.map((event: any) => event.Sezione))
  ).map((name, index) => ({
    id: index + 1,
    name: String(name),
    avatar:
      "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75",
  }));
  const targetGroup: TargetGroup[] = Array.from(
    new Set(activities.map((event: any) => event.Gruppo))
  ).map((name, index) => ({
    id: index + 1,
    name: String(name),
  }));

  const difficulty: DifficultyLevel[] = Array.from(
    new Set(activities.map((event: any) => event.Difficolta))
  ).map((name, index) => ({
    id: index + 1,
    name: String(name),
  }));

  const handleOrganizerSelectionChange = (selectedKeys: any) => {
    const selectedNames = new Set(selectedKeys);
    setOrganizerFilter(selectedNames);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (selectedNames.size > 0) {
        const combined = Array.from(selectedNames).join(",");
        params.set("sezione", combined);
      } else {
        params.delete("sezione");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleTargetGroupSelectionChange = (selectedKeys: any) => {
    const selectedNames = new Set(selectedKeys);
    setTargetGroupFilter(selectedNames);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (selectedNames.size > 0) {
        const combined = Array.from(selectedNames).join(",");
        params.set("gruppo", combined);
      } else {
        params.delete("gruppo");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleDifficultySelectionChange = (selectedKeys: any) => {
    const selectedNames = new Set(selectedKeys);
    setDifficultyFilter(selectedNames);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (selectedNames.size > 0) {
        const combined = Array.from(selectedNames).join(",");
        params.set("difficolta", combined);
      } else {
        params.delete("difficolta");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleElevationChange = (range: number[]) => {
    setElevationGainRange(range);

    // Convert the two numbers in range into elevMin and elevMax
    const [minVal, maxVal] = range;

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");

      // If the range is NOT the default [0, 3000], then set query params
      if (minVal !== 0 || maxVal !== 3000) {
        params.set("elevMin", minVal.toString());
        params.set("elevMax", maxVal.toString());
      } else {
        // If it's the default range, remove any existing query params
        params.delete("elevMin");
        params.delete("elevMax");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleResetFilters = () => {
    // 1. Reset local states
    setOrganizerFilter(new Set());
    setTargetGroupFilter(new Set());
    setDifficultyFilter(new Set());
    setElevationGainRange([0, 3000]);

    // 2. Remove filter-related params from URL
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      params.delete("start");
      params.delete("end");
      params.delete("sezione");
      params.delete("gruppo");
      params.delete("difficolta");
      params.delete("elevMin");
      params.delete("elevMax");
      params.delete("categoria");

      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="mx-12 lg:mx-0"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Filtri</ModalHeader>
            <div className="lg:hidden px-6 pb-2">
              <Search placeholder="Cerca attività..." />
            </div>
            <ModalBody>
              <Select
                items={uniqueOrganizerSections}
                label="Sezione Organizzatrice"
                variant="bordered"
                isMultiline={true}
                selectionMode="multiple"
                placeholder="Seleziona una sezione"
                selectedKeys={organizerFilter as any}
                onSelectionChange={handleOrganizerSelectionChange}
                multiple
                labelPlacement="outside"
                classNames={{
                  base: "",
                  trigger: "min-h-unit-12 py-2",
                }}
                renderValue={(items) => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {items?.map((item) => (
                        <Chip key={item.key} className="capitalize">
                          {item.data?.name}
                        </Chip>
                      ))}
                    </div>
                  );
                }}
              >
                {(organizerSection) => (
                  <SelectItem
                    key={organizerSection.name}
                    value={organizerSection.name}
                    textValue={organizerSection.name}
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar
                        alt={organizerSection.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={organizerSection.avatar}
                      />
                      <div className="flex flex-col">
                        <span className="text-small capitalize">
                          {organizerSection.name}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Select
                label="Gruppo target"
                placeholder="Seleziona un gruppo"
                selectionMode="multiple"
                selectedKeys={targetGroupFilter as any}
                onSelectionChange={handleTargetGroupSelectionChange}
                className=""
              >
                {targetGroup
                  ?.filter((target) => target.name !== "null")
                  .map((target) => (
                    <SelectItem key={target.name} value={target.name}>
                      {target.name}
                    </SelectItem>
                  ))}
              </Select>
              <Select
                label="Difficoltà"
                placeholder="Seleziona un grado di difficoltá"
                selectionMode="multiple"
                selectedKeys={difficultyFilter as any}
                onSelectionChange={handleDifficultySelectionChange}
                className=""
              >
                {difficulty
                  ?.filter((difficultyLevel) => difficultyLevel.name !== "null")
                  .map((difficultyLevel) => (
                    <SelectItem
                      key={difficultyLevel.name}
                      value={difficultyLevel.name}
                    >
                      {difficultyLevel.name}
                    </SelectItem>
                  ))}
              </Select>
              <Slider
                label="Dislivello in salita"
                step={50}
                minValue={0}
                maxValue={3000}
                defaultValue={[0, 3000]}
                formatOptions={{ style: "unit", unit: "meter" }}
                size="sm"
                showOutline
                value={elevationGainRange}
                onChange={handleElevationChange as any}
                className="max-w-md"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                startContent={<Undo className="h-4 w-4" />}
                onPress={handleResetFilters}
              >
                Cancella filtri
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
