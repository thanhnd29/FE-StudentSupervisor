import { classApi } from '@/core/api/class.api';
import { teacherApi } from '@/core/api/tearcher.api';
import { violationTypeApi } from '@/core/api/violation-type.api';
import { violationsApi } from '@/core/api/violation.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux';

const Page = () => {
  const { id } = Route.useParams();
  const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
    (state: RootState) => state.user,
  );

  const violationQuery = useQuery({
    queryKey: ['discipline', id],
    queryFn: () => {
      return violationsApi.getByDisciplineId(Number(id));
    },
  });

  if (violationQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!violationQuery.data) return null;

  return (
    <FieldBuilder
      fields={[
        {
          key: 'studentCode',
          title: 'Mã học sinh',
          type: FieldType.TEXT,
        },
        {
          key: 'studentName',
          title: 'Tên học sinh',
          type: FieldType.TEXT,
        },
        {
          key: 'classId',
          title: 'Lớp',
          type: FieldType.BADGE_API,
          apiAction(value) {
            return classApi.getEnumSelectOptions({ search: value });
          },
        },
        {
          key: 'violationName',
          title: 'Vi phạm',
          type: FieldType.TEXT,
        },
        {
          key: 'violationTypeId',
          title: 'Loại vi phạm',
          type: FieldType.BADGE_API,
          apiAction(value) {
            return violationTypeApi.getEnumSelectOptions(schoolId, value);
          },
        },
        {
          key: 'violationGroupName',
          title: 'Nhóm vi phạm',
          type: FieldType.TEXT,
        },
        {
          key: 'date',
          title: 'Ngày',
          type: FieldType.TIME_DATE,
        },
        {
          key: 'description',
          title: 'Mô tả',
          type: FieldType.MULTILINE_TEXT,
          formatter(value) {
            return value || 'N/A';
          },
        },
        {
          key: 'imageUrls',
          title: 'Hình ảnh',
          type: FieldType.MULTIPLE_IMAGES,
        },
        {
          key: 'createdAt',
          title: 'Tạo ngày',
          type: FieldType.TIME_DATE,
        },
        {
          key: 'updatedAt',
          title: 'Cập nhật ngày',
          type: FieldType.TIME_DATE,
        },
        {
          key: 'year',
          title: 'Niên khóa',
          type: FieldType.TEXT,
        },
        {
          key: 'status',
          title: 'Trạng thái',
          type: FieldType.BADGE_API,
          apiAction: violationsApi.getEnumStatuses
        },
      ]}
      record={violationQuery.data}
      title="Chi tiết vi phạm"
    />
  );
};

export const Route = createFileRoute('/_admin-layout/dashboard/disciplines/$id/')({
  component: Page
})