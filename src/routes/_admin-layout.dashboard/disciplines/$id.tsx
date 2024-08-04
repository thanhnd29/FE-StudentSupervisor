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
          key: 'studentCode',
          title: 'Code',
          type: FieldType.TEXT,
        },
        {
          key: 'violationName',
          title: 'Name',
          type: FieldType.TEXT,
        },
        {
          key: 'violationGroupName',
          title: 'Group',
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
          key: 'description',
          title: 'Description',
          type: FieldType.MULTILINE_TEXT,
          formatter(value) {
            return value || 'N/A';
          },
        },
        {
          key: 'teacherId',
          title: 'Teacher',
          type: FieldType.BADGE_API,
          apiAction(value) {
            return teacherApi.getEnumSelectOptions(value);
          },
        },
        {
          key: 'violationTypeId',
          title: 'Violation Type',
          type: FieldType.BADGE_API,
          apiAction(value) {
            return violationTypeApi.getEnumSelectOptions(schoolId, value);
          },
        },
        {
          key: 'imageUrls',
          title: 'Images',
          type: FieldType.MULTIPLE_IMAGES,
        },
        {
          key: 'createdAt',
          title: 'Created At',
          type: FieldType.TIME_DATE,
        },
        {
          key: 'updatedAt',
          title: 'Updated At',
          type: FieldType.TIME_DATE,
        },
        {
          key: 'year',
          title: 'Year',
          type: FieldType.TEXT,
        },
        {
          key: 'status',
          title: 'Status',
          type: FieldType.BADGE_API,
          apiAction: violationsApi.getEnumStatuses
        },
      ]}
      record={violationQuery.data}
      title="Violation Detail"
    />
  );
};

export const Route = createFileRoute('/_admin-layout/dashboard/disciplines/$id')({
  component: Page
})