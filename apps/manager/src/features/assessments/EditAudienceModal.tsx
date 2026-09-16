import React, { useState, useEffect } from 'react';
import {
  Modal, Button, LevelSelector, EducationLevel, Department,
  EDUCATION_LEVELS, DepartmentSelector,
} from '@cbt/shared';

interface Props {
  isOpen: boolean;
  educationLevel: EducationLevel;
  selectedClasses: string[];
  department?: Department;
  onClose: () => void;
  onSave: (data: { educationLevel: EducationLevel; selectedClasses: string[]; department?: Department }) => void;
}

export const EditAudienceModal: React.FC<Props> = ({
  isOpen, educationLevel: initLvl, selectedClasses: initCls, department: initDept, onClose, onSave,
}) => {
  const [level, setLevel] = useState<EducationLevel>(initLvl);
  const [classes, setClasses] = useState<string[]>(initCls);
  const [dept, setDept] = useState<Department | undefined>(initDept);

  useEffect(() => {
    if (isOpen) {
      setLevel(initLvl);
      setClasses(initCls);
      setDept(initDept);
    }
  }, [isOpen, initLvl, initCls, initDept]);

  if (!isOpen) return null;

  const currentConfig = EDUCATION_LEVELS.find((l) => l.id === level);

  const handleLevelChange = (lvl: EducationLevel) => {
    setLevel(lvl);
    const cfg = EDUCATION_LEVELS.find((l) => l.id === lvl);
    if (cfg && cfg.classes.length > 0) setClasses([cfg.classes[0]]);
    if (!cfg?.hasDepartments) setDept(undefined);
  };

  const handleToggleClass = (cls: string) => {
    setClasses((prev) => prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]);
  };

  const handleSave = () => {
    onSave({ educationLevel: level, selectedClasses: classes, department: currentConfig?.hasDepartments ? dept : undefined });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Target Audience & Classes" maxWidth={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <LevelSelector selectedLevel={level} onSelectLevel={handleLevelChange} />
        <div>
          <label className="cbt-input-label" style={{ marginBottom: 6, display: 'block' }}>Target Classes</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {currentConfig?.classes.map((cls) => (
              <Button key={cls} type="button" variant={classes.includes(cls) ? 'primary' : 'outline'} size="sm" onClick={() => handleToggleClass(cls)}>
                {cls}
              </Button>
            ))}
          </div>
        </div>
        {currentConfig?.hasDepartments && (
          <DepartmentSelector
            department={dept}
            onSelectDepartment={(v) => setDept((v || undefined) as any)}
            allowAll={true}
            allLabel="All Departments (General)"
            legendText="Department Stream"
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}>Cancel</Button>
          <Button type="button" variant="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}>Save Audience</Button>
        </div>
      </div>
    </Modal>
  );
};
