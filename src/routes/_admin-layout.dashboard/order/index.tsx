import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { FieldType } from '@/core/components/field/FieldDisplay';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { useSelector } from 'react-redux';
import { UserState } from '@/core/store/user';
import { orderApi } from '@/core/api/order.api';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
    const router = useNKRouter();
    const queryClient = useQueryClient();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const getByRole = () => {
        if (schoolId) {
            return orderApi.getBySchool()
        }
        return orderApi.getByAdmin()
    };

    const title = isAdmin ? "Doanh thu" : "Hóa đơn"

    useDocumentTitle(title);

    return (
        <div>
            <div className="">
                <TableBuilder
                    sourceKey="orders"
                    title={title}
                    columns={[
                        {
                            key: 'orderId',
                            title: 'ID',
                            type: FieldType.TEXT,
                            width: '50px'
                        },
                        {
                            key: 'schoolName',
                            title: 'Trường',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'packageName',
                            title: 'Gói',
                            type: FieldType.TEXT,
                        },
                        {
                            key: 'total',
                            title: 'Tổng tiền',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'amountPaid',
                            title: 'Số tiền đã trả',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'amountRemaining',
                            title: 'Số tiền chưa trả',
                            type: FieldType.NUMBER,
                        },
                        {
                            key: 'date',
                            title: 'Ngày thanh toán',
                            type: FieldType.TIME_DATE,
                        },
                        {
                            key: 'status',
                            title: 'Trạng thái',
                            type: FieldType.BADGE_API,
                            apiAction: orderApi.getEnumStatuses
                        },
                    ]}
                    queryApi={getByRole}
                />
            </div>
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/order/')({
    component: Page,
})