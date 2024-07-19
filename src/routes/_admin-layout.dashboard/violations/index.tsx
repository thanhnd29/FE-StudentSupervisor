import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { classApi } from '@/core/api/class.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { violationsApi } from '@/core/api/violation.api';
import CTAButton from '@/core/components/cta/CTABtn';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { FilterComparator } from '@/core/models/common';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { toastError } from '@/core/utils/api.helper';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { ViolationStatus } from '@/core/models/violation';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const getClass = () => {
        if (schoolId) {
            if (isTeacher) {
                return violationsApi.getBySchool(schoolId).then((res) => res.filter((x) => x.status === ViolationStatus.APPROVED));
            }
            return violationsApi.getBySchool(schoolId)
        }
        return violationsApi.getAll()
    };

    useDocumentTitle('Violations');

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="violations"
                    title="Violations"
                    columns={[
                        {
                            key: 'violationId',
                            title: 'ID',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'studentName',
                            title: 'Student',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'violationName',
                            title: 'Name',
                            type: FieldType.TEXT,
                        },

                        {
                            key: 'date',
                            title: 'Date',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'classId',
                            title: 'Class',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return classApi.getEnumSelectOptions(value);
                            },
                        },
                        {
                            key: 'violationGroupName',
                            title: 'Group',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'violationTypeId',
                            title: 'Type',
                            type: FieldType.BADGE_API,
                            apiAction(value) {
                                return violationTypeApi.getEnumSelectOptions(value);
                            },
                        },
                    ]}
                    queryApi={getClass}
                    actionColumns={(record) => (
                        <div className="flex flex-col gap-2">
                            <Button
                                icon={<EyeOutlined />}
                                type="primary"
                                size="small"
                                onClick={() => {
                                    router.push(NKRouter.violations.detail(record.violationId));
                                }}
                            />
                            <Button
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => {
                                    router.push(NKRouter.violations.edit(record.violationId));
                                }}
                            />
                            <CTAButton
                                ctaApi={() => violationTypeApi.delete(record.violationTypeId)}
                                isConfirm
                                confirmMessage="Are you sure you want to delete this violation type?"
                                extraOnError={toastError}
                                extraOnSuccess={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['violation-types'],
                                    });

                                    toast.success('Delete violation type successfully');
                                }}
                            >
                                <Button className="flex h-6 w-6 items-center justify-center p-0" danger type="primary" size="small">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CTAButton>
                        </div>
                    )}
                    filters={[
                        {
                            label: 'Name',
                            comparator: FilterComparator.LIKE,
                            name: 'violationName',
                            type: NKFormType.TEXT,
                        },
                    ]}
                    extraButtons={
                        <div className="flex items-center gap-3">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    router.push(NKRouter.violations.createForStudent());
                                }}
                            >
                                Create Violation Student
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    router.push(NKRouter.violations.createForSupervisor());
                                }}
                            >
                                Create Violation Supervisor
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violations/')({
    component: Page,
});
