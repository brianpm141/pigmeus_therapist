import React, { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormSection, FormPairRows, StatusModal } from '@/components/layout/Molecules';
import { Input, SegmentedControl, DatePicker, TextArea, FormButton } from '@/components/ui/UIComponents';
import { savePatient, updatePatient } from '@/services/patientService';
import { Patient } from '@/types/patient';

interface PatientFormProps {
    onSuccess: (updatedData?: any) => void;
    initialData?: Patient | null;
}

export const PatientForm = ({ onSuccess , initialData}: PatientFormProps) => {
    const { t } = useTranslation();
    const today = new Date();
    const isEditing = !!initialData;

    const genderOptions = [
        { label: t('data.male'), value: 'male' },
        { label: t('data.female'), value: 'female' },
        { label: t('data.other'), value: 'other' },
    ];

    // --- ESTADOS DE DATOS ---
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bornDate, setBornDate] = useState(today);
    
    // Estados para manejo de edad
    const [age, setAge] = useState<number>(0); // Valor numérico para la DB
    const [ageLabel, setAgeLabel] = useState('----'); // Texto para la UI
    
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

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
        if (initialData) {
            // CARGAR DATOS
            const nameParts = initialData.fullName.split(' ');
            setName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');

            // Convertir Timestamp a Date de forma segura
            const date = initialData.personalInfo.bornDate.toDate 
                ? initialData.personalInfo.bornDate.toDate() 
                : new Date(initialData.personalInfo.bornDate as any);
            
            setBornDate(date);
            setWeight(initialData.physicalMetrcs?.weight?.toString() || '');
            setHeight(initialData.physicalMetrcs?.height?.toString() || '');
            setGender(initialData.personalInfo?.gender || 'male');
            setDiagnosis(initialData.clinicalRecord?.diagnosis || '');
            setTreatmentPlan(initialData.clinicalRecord?.treatmentPlan || '');
            setPhone(initialData.contact?.phone || '');
            setAddress(initialData.contact?.address || '');
            setEmergencyContactName(initialData.contact?.emergencyContactName || '');
            setEmergencyContactPhone(initialData.contact?.emergencyContactPhone || '');
        } else { 
            //Reset de los datos
            setName('');
            setLastName('');
            setBornDate(today);
            setWeight('');
            setHeight('');
            setGender('male');
            setDiagnosis('');
            setTreatmentPlan('');
            setPhone('');
            setAddress('');
            setEmergencyContactName('');
            setEmergencyContactPhone('');
            setAgeLabel('----');
        }
    }, [initialData]);

    // --- CALCULO DE EDAD ---
    useEffect(() => {
        // Quitamos el IF restrictivo para que calcule siempre que la fecha cambie
        const birth = new Date(bornDate);
        const now = new Date();
        
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += lastMonth;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years >= 1) {
            setAge(years);
            setAgeLabel(`${years} ${t('data.years')}`);
        } else if (months >= 1) {
            setAge(0);
            setAgeLabel(`${months} ${t('data.months')}`);
        } else {
            setAge(0);
            setAgeLabel(`${Math.max(0, days)} ${t('data.days')}`);
        }
    }, [bornDate]);

    const onSubmit = async () => {
        setLoading(true);
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = t('errors.empty');
        if (!lastName.trim()) newErrors.lastName = t('errors.empty');

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});
        
        // Estructura de payload EXACTA a tu interfaz Patient
        const patientPayload = {
            fullName: `${name} ${lastName}`.trim(),
            personalInfo: { 
                bornDate: Timestamp.fromDate(bornDate), 
                age, 
                gender 
            },
            physicalMetrcs: {
                weight: parseFloat(weight) || 0,
                height: parseFloat(height) || 0
            },
            clinicalRecord: { diagnosis, treatmentPlan },
            contact: { 
                phone, 
                address, 
                emergencyContactName, 
                emergencyContactPhone 
            }
        };

        try {
            let result;
            if (isEditing && initialData?.id) {
                result = await updatePatient(initialData.id, patientPayload);
            } else {
                result = await savePatient(patientPayload);
            }

            if (result.success) {
                // Importante: devolvemos el ID para que la vista de detalles no se rompa
                onSuccess({ ...patientPayload, id: initialData?.id || (result as any).id });
            }
        } catch (e) {
            setStatusModal((last) => ({
                ...last,
                visible: true,
                title: t('info.errorSavePacient'),
                message: t('info.errorSavePacient'),
                confirmLabel: t('info.errorSaveConfirm'),
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1">
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
                        label={t('data.age')}
                        value={ageLabel} // Muestra años, meses o días
                        editable={false}
                        className='border-primary'
                    />
                </FormPairRows>
            </FormSection>

            <FormSection titleKey={t('FormPatient.physicalInfo')} iconName="add-chart">
                <FormPairRows>
                    <View className="relative w-full">
                        <Input 
                            label={t('data.weight')} 
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
                            label={t('data.height')} 
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

            <FormSection titleKey={t('FormPatient.medicalData')} iconName="healing">
                <TextArea
                    label={t('data.diagnosis')}
                    placeholder={t('FormPatient.diagnosisPlaceholder')}
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                    error={errors.diagnosis}
                />
                <TextArea
                    label={t('data.treatmentPlan')}
                    placeholder={t('FormPatient.tratamentPlanPlaceholder')}
                    value={treatmentPlan}
                    onChangeText={setTreatmentPlan}
                    error={errors.treatmentPlan}
                />
            </FormSection>

            <FormSection titleKey={t('FormPatient.contactInfo')} iconName='contact-phone'>
                <Input 
                    label={t('data.phone')}
                    placeholder={'55 6666 7777'}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    error={errors.phone}
                />
                <Input
                    label={t('data.address')} 
                    placeholder={t('FormPatient.adressPlaceholder')}
                    value={address}
                    onChangeText={setAddress}
                    error={errors.address}
                />
            </FormSection>

            <FormSection titleKey={t('FormPatient.emergencyContact')}>
                <Input
                    label={t('FormPatient.emergencyContactName')} 
                    placeholder={t('FormPatient.emergencyContactPlaceholder')}
                    value={emergencyContactName}
                    onChangeText={setEmergencyContactName}
                    error={errors.emergencyContact}
                />
                <Input 
                    label={t('FormPatient.emergencyContactPhone')}
                    placeholder={'55 6666 7777'}
                    keyboardType="phone-pad"
                    value={emergencyContactPhone}
                    onChangeText={setEmergencyContactPhone}
                    error={errors.emergencyContactPhone}
                />
            </FormSection>

            <FormButton 
                title={isEditing ? t('actions.update') : t('actions.save')}
                onPress={onSubmit}
                iconName='save'
                isLoading={loading}
            />
            
            <View className="h-10" />

            <StatusModal
                isVisible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onConfirm={() => {
                    setStatusModal((last) => ({...last, visible: false} ))
                    setLoading(false)
                }}
                confirmLabel={statusModal.confirmLabel}
            />
        </ScrollView>
    );
};