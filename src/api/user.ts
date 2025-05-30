import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types/model/user';
import {
	CreateUserDto,
	FetchUserDto,
	UpdateUserDto,
	FetchUserWithRolesResponseDto, UserWithRoles
} from '@/types/dto/user';
import { PaginationParams } from "@/util/pagination/type";
import { getPaginationRange } from "@/util/pagination/pagination";
import { toCamelCaseKeys, toSnakeCaseKeys } from "@/util/case/case";

// 유저 검색 api
export const fetchUser = async (params?: PaginationParams & FetchUserDto): Promise<FetchUserWithRolesResponseDto> => {
	let query = supabase
		.from('users')
		.select(
			`
				*,
				user_roles (
			        role_id,
			        roles (
			            role_code,
			            role_name
			        )
			    )
			`,
			{ count: 'exact' }
		);

	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.name) query = query.ilike('name', `%${params.name}%`);
		if (params.email) query = query.ilike('email', `%${params.email}%`);
		if (params.phoneNumber) query = query.eq('phone_number', params.phoneNumber);
		if (params.status) query = query.eq('status', params.status);
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	const { data, count, error } = await query;
	if (error) throw error;

	return {
		data: toCamelCaseKeys<UserWithRoles[]>(data ?? []),
		totalCount: count ?? 0,
	};
};

// 유저 등록 api
export const createUser = async (user: CreateUserDto): Promise<User> => {
	const userSnake = toSnakeCaseKeys<CreateUserDto>(user);
	const { data, error } = await supabase.from('users').insert(userSnake).single();
	if (error) throw error;
	return toCamelCaseKeys<User>(data);
};

// 유저 수정 api
export const updateUser = async (
	userId: string,
	update: UpdateUserDto
): Promise<User> => {
	const { data, error } = await supabase
	.from('users')
	.update(update)
	.eq('id', userId)
	.single();

	if (error) throw error;
	return toCamelCaseKeys<User>(data);
};

// 유저 삭제 api
export const deleteUser = async (userId: string): Promise<void> => {
	const { error } = await supabase.from('users').delete().eq('id', userId);
	if (error) throw error;
};

// 유저 삭제(상태 변경) api
export const softDeleteUser = async (userId: string): Promise<User> => {
	const { data, error } = await supabase
	.from('users')
	.update({ status: 'deleted' })
	.eq('id', userId)
	.single();

	if (error) throw error;
	return toCamelCaseKeys<User>(data);
}