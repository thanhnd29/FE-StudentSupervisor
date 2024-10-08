import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Joi from 'joi';

import { NKConstant } from '@/core/NKConstant';
import { classApi } from '@/core/api/class.api';
import { studentInClassApi } from '@/core/api/student-in-class.api';
import { teacherApi } from '@/core/api/tearcher.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { violationsApi } from '@/core/api/violation.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { toastError } from '@/core/utils/api.helper';
import { toast } from 'react-toastify';

const Page = () => {
    const { id } = Route.useParams();
    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId, userId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const violationQuery = useQuery({
        queryKey: ['violation', id],
        queryFn: () => {
            return violationsApi.getById(Number(id));
        },
    });

    const [classId, setClassId] = useState(0);

    const studentInClassQuery = useQuery({
        queryKey: ['student-in-class-select', classId],
        queryFn: () => {
            return studentInClassApi.getEnumSelectOptions({ classId });
        },
        initialData: [],
    });

    if (violationQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (!violationQuery.data) return null;

    return (
        <div>
            <FormBuilder
                apiAction={(data) => {
                    return violationsApi.updateSupervisor(Number(id), {
                        ...data,
                        Date: data.Date.toISOString(),
                        UserId: userId,
                    });
                }}
                title="Update Violation"
                defaultValues={{
                    ClassId: violationQuery.data.classId,
                    Date: new Date(violationQuery.data.date),
                    Description: violationQuery.data.description,
                    ViolationName: violationQuery.data.violationName,
                    ViolationTypeId: violationQuery.data.violationTypeId,
                    Images: violationQuery.data.imageUrls,
                    StudentInClassId: violationQuery.data.studentInClassId,
                }}
                schema={{
                    ClassId: Joi.number().required().messages(NKConstant.MESSAGE_FORMAT),
                    Date: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                    Description: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
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
                        name: 'ViolationTypeId',
                        label: 'Violation Type',
                        type: NKFormType.SELECT_API_OPTION,
                        fieldProps: {
                            apiAction: (value) => violationTypeApi.getEnumSelectOptions(schoolId, value),
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
                onExtraSuccessAction={(data) => {
                    toast.success(data.message || 'Successful');
                }}
            />
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violations/$id/edit')({
    component: Page,
});
