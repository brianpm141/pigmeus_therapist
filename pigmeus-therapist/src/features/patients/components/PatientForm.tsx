import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormSection, FormPairRows, StatusModal } from '@/components/layout/Molecules';
import { Input, SegmentedControl, DatePicker, TextArea, FormButton } from '@/components/ui/UIComponents';
import { savePatient } from '@/services/patientService';
import { setISODay } from 'date-fns';

interface PatientFormProps {
    onSuccess: () => void;
}

export const PatientForm = ({ onSuccess }: PatientFormProps) => {
    const { t } = useTranslation();
    const today = new Date();

    const genderOptions = [
        { label: t('FormPatient.male'), value: 'male' },
        { label: t('FormPatient.female'), value: 'female' },
        { label: t('FormPatient.other'), value: 'other' },
    ];

    // --- ESTADOS DE DATOS ---
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bornDate, setBornDate] = useState(today);
    const [age, setAge] = useState('----');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false)
    const [statusModal , setStatusModal] = useState({
        visible: false,
        type: 'error' as const,
        title: '',
        message: '',
        confirmLabel:'',
        cancelLabel:''
    })
    


    useEffect(() => {
        if (bornDate.toDateString() !== today.toDateString()) {
            let auxAge = today.getFullYear() - bornDate.getFullYear();
            const monthDiff = today.getMonth() - bornDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bornDate.getDate())) {
                auxAge--;
            }
            setAge(auxAge > 0 ? auxAge.toString() : '0');
        }
    }, [bornDate]);

    const onSubmit = async () => {
        setLoading(true)
        const newErrors: Record<string, string> = {};

        // Validaciones de presencia (vacíos)
        if (!name.trim()) newErrors.name = t('errors.empty');
        if (!lastName.trim()) newErrors.lastName = t('errors.empty');
        if (bornDate.toDateString() === today.toDateString()) newErrors.bornDate = t('errors.emptyDate');
        if (!weight) newErrors.weight = t('errors.empty');
        if (!height) newErrors.height = t('errors.empty');
        if (!diagnosis.trim()) newErrors.diagnosis = t('errors.empty');
        if (!treatmentPlan.trim()) newErrors.treatmentPlan = t('errors.empty');
        if (!phone.trim()) newErrors.phone = t('errors.empty');

        // Validaciones de rangos numéricos (Peso y Altura)
        if (weight && parseFloat(weight) > 500) {
            newErrors.weight = t('errors.exWeight');
        }
        if (height && parseFloat(height) > 300) {
            newErrors.height = t('errors.exHeight');
        }

        const phoneRegex = /^\+?[0-9]{10,13}$/;
        if (!phone.trim()) {
            newErrors.phone = t('errors.empty');
        } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            newErrors.phone = t('errors.invalidPhone');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false)
            return;
        }

        setErrors({});
        setLoading(true)
        const patientPayload = {
            fullName: `${name} ${lastName}`,
            personalInfo:{ bornDate, age, gender },
            physicalMetrcs:{
                weight: parseFloat(weight),
                height: parseFloat(height)
            },
            clinicalRecord: {diagnosis, treatmentPlan},
            contact: {phone, address, emergencyContact}
        }

        try {
            const result = await savePatient(patientPayload) 
            if(result.success){
                onSuccess()
            }

        } catch (e) {
            setStatusModal( (last) => ({
                ...last,
                visible: true,
                title: t('info.errorSavePacient'),
                message: t('info.errorSavePacient'),
                confirmLabel:t('info.errorSaveConfirm'),
            }) );
            console.error(e);
        }
    };

    return (
        <ScrollView className="flex-1">
            {/* SECCIÓN: DATOS PERSONALES */}
            <FormSection titleKey={t('FormPatient.personalData')} iconName="account-box">
                <Input 
                    label={t('FormPatient.name')} 
                    placeholder="Ej. Juan" 
                    value={name}
                    onChangeText={setName}
                    maxLength={50}
                    error={errors.name}
                />
                <Input 
                    label={t('FormPatient.lastName')} 
                    placeholder="Ej. Pérez García" 
                    value={lastName}
                    onChangeText={setLastName}
                    maxLength={100}
                    error={errors.lastName} 
                /> 
                <FormPairRows>
                    <DatePicker 
                        label={t('FormPatient.bornDate')} 
                        onChange={setBornDate}
                        maximumDate={today}
                        value={bornDate}
                        error={errors.bornDate}
                    />
                    <Input
                        label={t('FormPatient.age')}
                        value={age}
                        editable={false}
                    />
                </FormPairRows>
            </FormSection>

            {/* SECCIÓN: DATOS FÍSICOS */}
            <FormSection titleKey={t('FormPatient.physicalInfo')} iconName="add-chart">
                <FormPairRows>
                    <View className="relative w-full">
                        <Input 
                            label={t('FormPatient.weight')} 
                            placeholder="kg" 
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={(num) => setWeight(num.replace(/[^0-9.]/g, ''))}
                            error={errors.weight}
                        />
                        {weight.length > 0 && (
                            <View pointerEvents="none" className="absolute right-5 bottom-8">
                                <Text className="text-text-secondary dark:text-text-inverse opacity-60 font-medium">kg</Text>
                            </View>
                        )}
                    </View>
                    <View className="relative w-full">
                        <Input 
                            label={t('FormPatient.height')} 
                            placeholder="cm" 
                            keyboardType="numeric"
                            value={height}
                            onChangeText={(num) => setHeight(num.replace(/[^0-9.]/g, ''))}
                            error={errors.height}
                        />
                        {height.length > 0 && (
                            <View pointerEvents="none" className="absolute right-5 bottom-8">
                                <Text className="text-text-secondary dark:text-text-inverse opacity-60 font-medium">cm</Text>
                            </View>
                        )}
                    </View>
                </FormPairRows>
                <SegmentedControl
                    label={t('FormPatient.gender')}
                    options={genderOptions}
                    value={gender}
                    onChange={setGender}
                />
            </FormSection>

            {/* SECCIÓN: DATOS MÉDICOS */}
            <FormSection titleKey={t('FormPatient.medicalData')} iconName="healing">
                <TextArea
                    label={t('FormPatient.diagnosis')}
                    placeholder={t('FormPatient.diagnosisPlaceholder')}
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                    error={errors.diagnosis}
                />
                <TextArea
                    label={t('FormPatient.tratamentPlan')}
                    placeholder={t('FormPatient.tratamentPlanPlaceholder')}
                    value={treatmentPlan}
                    onChangeText={setTreatmentPlan}
                    error={errors.treatmentPlan}
                />
            </FormSection>

            {/* SECCIÓN: CONTACTO */}
            <FormSection titleKey={t('FormPatient.contactInfo')} iconName='contact-phone'>
                <Input 
                    label={t('FormPatient.phone')}
                    placeholder={'1234567890'}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    error={errors.phone}
                />
                <Input
                    label={t('FormPatient.address')} 
                    placeholder={t('FormPatient.adressPlaceholder')}
                    value={address}
                    onChangeText={setAddress}
                    error={errors.address}
                />
                <Input
                    label={t('FormPatient.emergencyContact')} 
                    placeholder={t('FormPatient.emergencyContactPlaceholder')}
                    value={emergencyContact}
                    onChangeText={setEmergencyContact}
                    error={errors.emergencyContact}
                />
            </FormSection>

            <FormButton 
                title={t('actions.save')}
                onPress={onSubmit}
                iconName='save'
                isLoading={loading}
            />
            
            <View className="h-10" />

            <StatusModal
                isVisible={statusModal.visible}
                type={statusModal.type}
                title={t('')}
                message={statusModal.message}
                onConfirm={() => {
                    setStatusModal( (last) => ({...last, visible: false} ))
                    setLoading(false)
                }}
                confirmLabel={statusModal.confirmLabel}
            />

        </ScrollView>
    );
};