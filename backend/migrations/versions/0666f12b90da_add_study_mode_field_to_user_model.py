"""Add study_mode field to User model

Revision ID: 0666f12b90da
Revises: 157d4aec3f1a
Create Date: 2025-10-11 13:52:29.109312

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0666f12b90da'
down_revision = '157d4aec3f1a'
branch_labels = None
depends_on = None


def upgrade():
    # Add study_mode field to users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('study_mode', sa.String(length=32), nullable=True))
        batch_op.create_index('ix_users_study_mode', ['study_mode'], unique=False)


def downgrade():
    # Remove study_mode field from users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_index('ix_users_study_mode')
        batch_op.drop_column('study_mode')
