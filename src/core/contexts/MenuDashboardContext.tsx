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
            label: 'Package',
            key: 'packages',
            icon: <Package className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.package.list());
            },
        },
        {
            label: 'Year Package',
            key: 'year-package',
            icon: <Package className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.yearPackage.list());
            },
        },
        {
            label: 'Registed Schools',
            key: 'registed-schools',
            icon: <Grab className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.registerSchool.list());
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
            label: 'Class Group',
            key: 'class-group',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classGroup.list());
            },
        },
        {
            label: 'Class',
            key: 'class',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classes.list());
            },
        },
        {
            label: 'Students In Class',
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
            label: 'School Year',
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
            label: 'Teachers',
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
            label: 'Users',
            key: 'users',
            icon: <UsersRound className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.user.list());
            },
        },
        {
            label: 'Violations',
            key: 'violations',
            icon: <Group className="h-4 w-4" />,
            children: [
                {
                    label: 'Violation Group',
                    key: 'violation-group',
                    onClick: () => {
                        router.push(NKRouter.violationGroup.list());
                    },
                },
                {
                    label: 'Violation Types',
                    key: 'violation-types',
                    onClick: () => {
                        router.push(NKRouter.violationType.list());
                    },
                },
                {
                    label: 'Violations Configs',
                    key: 'violations-configs',
                    onClick: () => {
                        router.push(NKRouter.violationConfig.list());
                    },
                },
                {
                    label: 'Violations',
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
            label: 'Evaluations',
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
            label: 'Student Supervisors',
            key: 'student-supervisors',
            icon: <Glasses className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.studentSupervisor.list());
            },
        },
        {
            label: 'Penalties',
            key: 'penalties',
            icon: <CircleSlash2 className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.penalty.list());
            },
        },
        {
            label: 'Buy Packages',
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
    ]

    const PrincipalMenu = [
        {
            label: 'Violation in week',
            key: 'violation-in-week',
            onClick: () => {
                router.push(NKRouter.violationTop.inWeek());
            },
        },
        {
            label: 'Violation in class',
            key: 'violation-in-class',
            onClick: () => {
                router.push(NKRouter.violationTop.inClass());
            },
        },
        {
            label: 'Violation in year',
            key: 'violation-in-year',
            onClick: () => {
                router.push(NKRouter.violationTop.inYear());
            },
        },
        {
            label: 'Violation top class',
            key: 'violation-top-class',
            onClick: () => {
                router.push(NKRouter.violationTop.topClass());
            },
        },
        {
            label: 'Violation top student',
            key: 'violation-top-student',
            onClick: () => {
                router.push(NKRouter.violationTop.topStudent());
            },
        },
        {
            label: 'Violation top studentInClass',
            key: 'violation-top-studentInClass',
            onClick: () => {
                router.push(NKRouter.violationTop.topStudentInClass());
            },
        },
    ]

    const SupervisorMenu = [
        {
            label: 'Class Group',
            key: 'class-group',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classGroup.list());
            },
        },
        {
            label: 'Violation',
            key: 'violation',
            icon: <Group className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.violations.list());
            },
        },
        {
            key: 'disciplines',
            label: 'Disciplines',
            icon: <ShieldHalf className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.discipline.list());
            },
        },
        {
            label: 'Patrol Schedule',
            key: 'patrol-schedule',
            icon: <Calendar className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.patrolSchedule.list());
            },
        },
    ];

    const TeacherMenu = [
        {
            label: 'Class',
            key: 'class',
            icon: <Ungroup className="h-4 w-4" />,
            onClick: () => {
                router.push(NKRouter.classes.list());
            },
        },
        {
            label: 'Violations',
            key: 'violations',
            onClick: () => {
                router.push(NKRouter.violations.list());
            },
            icon: <Group className="h-4 w-4" />,
        },
        {
            key: 'disciplines',
            label: 'Disciplines',
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
