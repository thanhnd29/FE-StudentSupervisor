import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Joi from 'joi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { classApi } from '@/core/api/class.api';
import { studentInClassApi } from '@/core/api/student-in-class.api';
import { teacherApi } from '@/core/api/tearcher.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { violationsApi } from '@/core/api/violation.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { toastError } from '@/core/utils/api.helper';

const Page = () => {
    const router = useNKRouter();
    const [classId, setClassId] = useState(0);
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolAdminId, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const studentInClassQuery = useQuery({
        queryKey: ['student-in-class-select', classId],
        queryFn: () => {
            return studentInClassApi.getEnumSelectOptions({ classId });
        },
        initialData: [],
    });

    return (
        <div>
            <FormBuilder
                apiAction={(data) => {
                    return violationsApi.createForStudent({
                        ...data,
                        Date: data.Date.toISOString(),
                    });
                }}
                title="Create Violation for Student"
                defaultValues={{
                    ClassId: 0,
                    Date: new Date(),
                    Description: '',
                    TeacherId: 0,
                    ViolationName: '',
                    ViolationTypeId: 0,
                    Images: [],
                    StudentInClassId: 0,
                }}
                schema={{
                    ClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    Date: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                    Description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                    TeacherId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    ViolationName: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                    ViolationTypeId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    Images: Joi.array().items(Joi.string()).required().messages(NKConstant.MESSAGE_FORMAT),
                    StudentInClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                }}
                fields={[
                    {
                        name: 'ViolationName',
                        label: 'Name',
                        type: NKFormType.TEXT,
                    },

                    {
                        name: 'Description',
                        label: 'Description',
                        type: NKFormType.TEXTAREA,
                    },
                    {
                        name: 'ClassId',
                        label: 'Class',
                        type: NKFormType.SELECT_API_OPTION,
                        fieldProps: {
                            apiAction: (value) => classApi.getEnumSelectOptions(value),
                        },
                        onChangeExtra(value) {
                            setClassId(value);
                        },
                    },
                    {
                        name: 'StudentInClassId',
                        label: 'Student',
                        type: NKFormType.SELECT_API_OPTION,
                        fieldProps: {
                            apiAction: async (value) => studentInClassQuery.data,
                        },
                    },
                    {
                        name: 'ViolationTypeId',
                        label: 'Violation Type',
                        type: NKFormType.SELECT_API_OPTION,
                        fieldProps: {
                            apiAction: (value) => violationTypeApi.getEnumSelectOptions(schoolId, value),
                        },
                    },
                    {
                        name: 'TeacherId',
                        label: 'Teacher',
                        type: NKFormType.SELECT_API_OPTION,
                        fieldProps: {
                            apiAction: (value) => teacherApi.getEnumSelectOptions(value),
                        },
                    },

                    {
                        name: 'Date',
                        label: 'Date',
                        type: NKFormType.DATE,
                    },
                    {
                        name: 'Images',
                        label: 'Images',
                        type: NKFormType.MULTI_UPLOAD_IMAGE,
                    },
                ]}
                onExtraErrorAction={toastError}
                onExtraSuccessAction={() => {
                    toast.success('Create a new violation successfully');
                    router.push(NKRouter.violations.list());
                }}
            />
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violations/create-student')({
    component: Page,
});
