import * as React from 'react';

import {
    Bolt,
    Calendar,
    CalendarRange,
    CircleSlash2,
    Clock,
    Glasses,
    Grab,
    Group,
    Package,
    ShieldHalf,
    Ungroup,
    UsersRound,
    Waves,
    ShoppingCart
} from 'lucide-react';
import { useSelector } from 'react-redux';

import { NKRouter } from '../NKRouter';
import { useNKRouter } from '../routing/hooks/NKRouter';
import { RootState } from '../store';
import { UserState } from '../store/user';
import { BarChartOutlined, DollarOutlined, ExclamationCircleOutlined, LineChartOutlined, TeamOutlined, TrophyOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';

export interface IMenuItem {
    key: string;
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    children?: IMenuItem[];
}

export interface IMenuDashboardContext {
    menu: IMenuItem[];
}

export const MenuDashboardContext = React.createContext<IMenuDashboardContext>({
    menu: [],
});

interface MenuDashboardProviderProps {
    children: React.ReactNode;
}

export const MenuDashboardProvider: React.FC<MenuDashboardProviderProps> = ({ children }) => {
    const router = useNKRouter();

    const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const AdminMenu = [
        {
            label: 'School Admin',
            key: 'school-admin',
            icon: <UsersRound className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.schoolAdmin.list());
            },
        },
        {
            label: 'Gói',
            key: 'packages',
            icon: <Package className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.package.list());
            },
        },
        {
            label: 'Gói năm',
            key: 'year-package',
            icon: <Package className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.yearPackage.list());
            },
        },
        {
            label: 'Trường đăng ký',
            key: 'registed-schools',
            icon: <Grab className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.registerSchool.list());
            },
        },
        {
            label: 'Doanh thu',
            key: 'orders',
            icon: <DollarOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.order.list());
            },
        },
    ];

    const SchoolAdminMenu = [
        // {
        //     label: 'High School',
        //     key: 'high-school',
        //     icon: <School className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.highSchool.list());
        //     },
        // },
        {
            label: 'Khối',
            key: 'class-group',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classGroup.list());
            },
        },
        {
            label: 'Lớp',
            key: 'class',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classes.list());
            },
        },
        {
            label: 'Học sinh',
            key: 'students-in-class',
            icon: <UsersRound className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.studentInClass.list());
            },
        },
        // {
        //     label: 'Classes',
        //     key: 'classes',
        //     icon: <TbBuildingWarehouse />,
        //     onClick: () => {
        //         router.push(NKRouter.classes.list());
        //     },
        // },
        {
            label: 'Niên khóa',
            key: 'school-year',
            icon: <CalendarRange className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.schoolYear.list());
            },
        },
        // {
        //     label: 'School Config',
        //     key: 'school-config',
        //     icon: <Bolt className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.schoolConfig.list());
        //     },
        // },
        // {
        //     label: 'Students',
        //     key: 'students',
        //     icon: <UsersRound className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.students.list());
        //     },
        // },
        {
            label: 'Giáo viên',
            key: 'teachers',
            icon: <UsersRound className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.teachers.list());
            },
        },
        // {
        //     label: 'Times',
        //     key: 'times',
        //     icon: <Clock className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.times.list());
        //     },
        // },
        {
            label: 'Tài khoản',
            key: 'users',
            icon: <UsersRound className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.user.list());
            },
        },
        {
            label: 'Quản lý Vi phạm',
            key: 'violations',
            icon: <Group className="h-4 w-4" />,
            children: [
                {
                    label: 'Nhóm vi phạm',
                    key: 'violation-group',
                    onClick: () => {
                        router.push(NKRouter.violationGroup.list());
                    },
                },
                {
                    label: 'Loại vi phạm',
                    key: 'violation-types',
                    onClick: () => {
                        router.push(NKRouter.violationType.list());
                    },
                },
                {
                    label: 'Cấu hình vi phạm',
                    key: 'violations-configs',
                    onClick: () => {
                        router.push(NKRouter.violationConfig.list());
                    },
                },
                {
                    label: 'Vi phạm',
                    key: 'violations',
                    onClick: () => {
                        router.push(NKRouter.violations.list());
                    },
                },
            ],
        },
        // {
        //     key: 'disciplines',
        //     label: 'Disciplines',
        //     icon: <ShieldHalf className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.discipline.list());
        //     },
        // },
        // {
        //     label: 'Package',
        //     key: 'packages',
        //     icon: <Package className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.package.list());
        //     },
        // },
        // {
        //     label: 'Year Package',
        //     key: 'year-package',
        //     icon: <Package className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.yearPackage.list());
        //     },
        // },
        {
            label: 'Đánh giá',
            key: 'evaluations',
            icon: <Waves className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.evaluation.list());
            },
        },
        // {
        //     label: 'Evaluation Details',
        //     key: 'evaluation-details',
        //     icon: <AudioWaveform className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.evaluationDetail.list());
        //     },
        // },
        {
            label: 'Sao đỏ',
            key: 'student-supervisors',
            icon: <Glasses className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.studentSupervisor.list());
            },
        },
        {
            label: 'Hình phạt',
            key: 'penalties',
            icon: <CircleSlash2 className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.penalty.list());
            },
        },
        {
            label: 'Mua gói',
            key: 'buy-packages',
            icon: <ShoppingCart className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.package.buy());
            },
        },
        // {
        //     label: 'Registed Schools',
        //     key: 'registed-schools',
        //     icon: <Grab className="h-4 w-4" />,
        //     onClick: () => {
        //         router.push(NKRouter.registerSchool.list());
        //     },
        // },
        {
            label: 'Hóa đơn',
            key: 'orders',
            icon: <DollarOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.order.list());
            },
        },
    ]

    const PrincipalMenu = [
        {
            label: 'Biểu đồ vi phạm',
            key: 'violation-chart',
            icon: <LineChartOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violationTop.violationChart());
            },
        },
        {
            label: 'Xếp hạng thi đua',
            key: 'evaluation-tops',
            icon: <TrophyOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.evaluationTop.list());
            },
        },
        {
            label: 'Top 5 học sinh vi phạm',
            key: 'violation-top-student',
            icon: <UserOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violationTop.topStudent());
            },
        },
        {
            label: 'Top 5 vi phạm thường xuyên',
            key: 'violation-in-year',
            icon: <ExclamationCircleOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violationTop.inYear());
            },
        },
        {
            label: 'Lớp vi phạm nhiều',
            key: 'violation-top-class',
            icon: <TeamOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violationTop.topClass());
            },
        },
        {
            label: 'Lớp có số lượng vi phạm nhiều',
            key: 'violation-top-studentInClass',
            icon: <BarChartOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violationTop.topStudentInClass());
            },
        },
        {
            label: 'Danh sách vi phạm theo lớp',
            key: 'violation-in-class',
            icon: <UnorderedListOutlined className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violationTop.inClass());
            },
        },
    ]

    const SupervisorMenu = [
        {
            label: 'Khối',
            key: 'class-group',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classGroup.list());
            },
        },
        {
            label: 'Vi phạm',
            key: 'violation',
            icon: <Group className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violations.list());
            },
        },
        {
            key: 'disciplines',
            label: 'Kỷ luật',
            icon: <ShieldHalf className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.discipline.list());
            },
        },
        {
            label: 'Lịch trực',
            key: 'patrol-schedule',
            icon: <Calendar className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.patrolSchedule.list());
            },
        },
    ];

    const TeacherMenu = [
        {
            label: 'Lớp',
            key: 'class',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classes.list());
            },
        },
        {
            label: 'Vi phạm',
            key: 'violations',
            onClick: () => {
                router.push(NKRouter.violations.list());
            },
            icon: <Group className="h-4 w-4" />,
        },
        {
            key: 'disciplines',
            label: 'Kỷ luật',
            icon: <ShieldHalf className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.discipline.list());
            },
        },
    ];

    const menu = React.useMemo(() => {
        if (isAdmin) {
            return AdminMenu;
        }

        if (isSchoolAdmin) {
            return SchoolAdminMenu
        }

        if (isPrincipal) {
            return PrincipalMenu
        }

        if (isSupervisor) {
            return SupervisorMenu;
        }

        if (isTeacher) {
            return TeacherMenu;
        }

    }, [isAdmin, isSupervisor, isPrincipal, isTeacher, isSchoolAdmin]);

    return (
        <MenuDashboardContext.Provider
            value={{
                menu: menu as IMenuItem[],
            }}
        >
            {children}
        </MenuDashboardContext.Provider>
    );
};

export const useMenuDashboard = () => React.useContext(MenuDashboardContext);
