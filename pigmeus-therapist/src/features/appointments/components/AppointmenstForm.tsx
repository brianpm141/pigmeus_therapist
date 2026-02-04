import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FloatingFormContainer, FormPairRows, FormSection } from '@/components/layout/Molecules';
import { DatePicker, FormButton, SegmentedControl, OptionSelector, Input } from '@/components/ui/UIComponents';
import { useTherapistProfile } from '@/features/auth/hooks/useTherapistProfile';
import { usePatients } from '@/features/patients/hooks/usePatients';
import { useCreateAppointment } from '@/features/appointments/hooks/useCreateAppointment';
import { ConsultationItem } from '@/types/appointments';

interface NewAppointmentFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenPatientForm?: () => void;
  initialData?: ConsultationItem | null;
}

export const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({
  visible,
  onClose,
  onSuccess,
  onOpenPatientForm,
  initialData
}) => {
  const { t } = useTranslation();
  const { profile } = useTherapistProfile();
  const { patients } = usePatients(profile?.uid);

  const formTitle = initialData ? t('formAppointments.editTitle') : t('appointments.newTitle');


  const { form, actions, ui } = useCreateAppointment(() => {
    onSuccess?.();
  }, initialData); 

  useEffect(() => {

    if (!visible) actions.resetForm();
  }, [visible]);

  const handleManualClose = () => {
    actions.resetForm();
    onClose();
  };

  const weeksInputRef = useRef<TextInput>(null);

  const patientOptions = useMemo(() =>
    patients.map(p => ({ label: p.fullName, value: p.id })),
    [patients]
  );

  const daysOfWeek = useMemo(() => [
    { id: 'L', label: t('appointments.mondayShort') },
    { id: 'M1', label: t('appointments.tuesdayShort') },
    { id: 'M2', label: t('appointments.wednesdayShort') },
    { id: 'J', label: t('appointments.thursdayShort') },
    { id: 'V', label: t('appointments.fridayShort') },
    { id: 'S', label: t('appointments.saturdayShort') },
    { id: 'D', label: t('appointments.sundayShort') },
  ], [t]);

  return (
    <FloatingFormContainer
      visible={visible}
      onClose={handleManualClose}
      title={formTitle}
      iconName="event"
    >
      <FormSection titleKey="appointments.patientSection" iconName='contact-page'>
        <OptionSelector
          label={t('appointments.patientLabel')}
          placeholder={t('appointments.selectPatient')}
          options={patientOptions}
          selectedValue={form.patientId}
          onSelect={(opt) => {
            form.setPatientId(opt.value);
            form.setPatientName(opt.label);
          }}
          error={ui.errors.patientId ? t(ui.errors.patientId) : undefined}
          onAddNew={onOpenPatientForm}
        />
      </FormSection>

      <FormSection titleKey={t('formAppointments.dateForm')} iconName='av-timer'>
        <FormPairRows>
          <DatePicker
            label={t('appointments.date')}
            value={form.date}
            onChange={form.setDate}
            placeholder={t('common.selectDateShort', 'Seleccionar')}
            error={ui.errors.date ? t(ui.errors.date) : undefined}
          />
          <View className="flex-1 flex-row gap-2">
            <View className="flex-1">
              <DatePicker
                label={t('appointments.hour')}
                mode="time"
                value={form.time}
                onChange={form.setTime}
                placeholder={t('common.selectTimeShort', 'Seleccionar')}
                error={ui.errors.time ? t(ui.errors.time) : undefined}
              />
            </View>
          </View>
        </FormPairRows>
        <Input
          label={t('appointments.durationShort', 'Minutos')}
          placeholder={t('formAppointments.durationPlaceholder')}
          keyboardType="number-pad"
          value={form.duration}
          onChangeText={form.setDuration}
          className="text-center"
          error={ui.errors.duration ? t(ui.errors.duration) : undefined}
        />
      </FormSection>

      <FormSection titleKey={t('formAppointments.recurrence')} iconName='timeline'>
        <SegmentedControl
          options={[
            { label: t('appointments.single'), value: 'single' },
            { label: t('formAppointments.program'), value: 'program' }
          ]}
          value={form.recurrence}
          onChange={(val) => form.setRecurrence(val as any)}
        />
      

      {form.recurrence === 'program' && (
        <View className="mt-6 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
          <Text className="font-bold mb-4 text-text-primary dark:text-text-inverse font-sans text-sm">
            {t('appointments.repeatDays')}
          </Text>

          <View className="flex-row justify-between mb-6">
            {daysOfWeek.map((day) => {
              const isSelected = form.selectedDays.includes(day.id);
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => actions.toggleDay(day.id)}
                  className={`w-9 h-9 rounded-lg items-center justify-center border ${isSelected
                    ? 'bg-primary border-primary'
                    : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-darker'
                    }`}
                >
                  <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {ui.errors.days && <Text className="text-status-danger text-xs -mt-4 mb-4">{t(ui.errors.days)}</Text>}

          <Text className="font-bold mb-3 text-text-primary dark:text-text-inverse font-sans text-sm">
            {t('appointments.endAfter')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => weeksInputRef.current?.focus()}
            className={`flex-row items-center p-3 mb-2 rounded-lg border ${form.endCondition === 'weeks'
              ? 'border-primary bg-primary/5'
              : 'border-border-light dark:border-border-dark'
              }`}
          >
            <View className={`w-4 h-4 rounded-full border items-center justify-center ${form.endCondition === 'weeks' ? 'border-primary' : 'border-text-secondary'}`}>
              {form.endCondition === 'weeks' && <View className="w-2 h-2 rounded-full bg-primary" />}
            </View>

            <View className="flex-row items-center ml-3 flex-1">
              <TextInput
                ref={weeksInputRef}
                className="bg-white dark:bg-surface-darker border border-border-light dark:border-border-dark rounded w-12 h-10 text-center font-bold text-text-primary dark:text-text-inverse mr-3"
                keyboardType="number-pad"
                value={form.repeatWeeks}
                onChangeText={actions.handleWeeksChange}
                placeholder="1"
                placeholderTextColor="#94a3b8"
              />
              <Text className="text-text-primary dark:text-text-inverse font-medium text-sm">
                {t('appointments.weeks')}
              </Text>
            </View>
          </TouchableOpacity>
          {ui.errors.weeks && <Text className="text-status-danger text-xs ml-2 mb-2">{t(ui.errors.weeks)}</Text>}

          <TouchableOpacity
            onPress={() => form.setEndCondition('manual')}
            className={`flex-row items-center p-3 rounded-lg border ${form.endCondition === 'manual'
              ? 'border-primary bg-primary/5'
              : 'border-border-light dark:border-border-dark'
              }`}
          >
            <View className={`w-4 h-4 rounded-full border items-center justify-center ${form.endCondition === 'manual' ? 'border-primary' : 'border-text-secondary'}`}>
              {form.endCondition === 'manual' && <View className="w-2 h-2 rounded-full bg-primary" />}
            </View>
            <Text className={`ml-3 font-medium text-sm ${form.endCondition === 'manual' ? 'text-text-primary dark:text-text-inverse' : 'text-text-secondary'}`}>
              {t('appointments.untilCancel')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      </FormSection>

      <FormButton
        title={t('appointments.submit')}
        className="mt-8 mb-4"
        onPress={actions.submit}
        isLoading={ui.isSubmitting}
        disabled={ui.isSubmitting}
      />
    </FloatingFormContainer>
  );
};