"""Add academic year fields to User model

Revision ID: 157d4aec3f1a
Revises: 
Create Date: 2025-10-10 17:33:44.357126

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '157d4aec3f1a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add academic year fields to users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('academic_year', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('academic_session', sa.String(length=32), nullable=True))
        batch_op.add_column(sa.Column('entry_year', sa.Integer(), nullable=True))
        batch_op.create_index('ix_users_academic_year', ['academic_year'], unique=False)
        batch_op.create_index('ix_users_academic_session', ['academic_session'], unique=False)
        batch_op.create_index('ix_users_entry_year', ['entry_year'], unique=False)


def downgrade():
    # Remove academic year fields from users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_index('ix_users_entry_year')
        batch_op.drop_index('ix_users_academic_session')
        batch_op.drop_index('ix_users_academic_year')
        batch_op.drop_column('entry_year')
        batch_op.drop_column('academic_session')
        batch_op.drop_column('academic_year')
